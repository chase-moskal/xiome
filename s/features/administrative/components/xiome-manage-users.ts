
import styles from "./xiome-manage-users.css.js"
import wrenchSvg from "../../../framework/icons/wrench.svg.js"

import {Op, ops} from "../../../framework/ops.js"
import {UserResult} from "../api/types/user-result.js"
import {debounce3} from "../../../toolbox/debounce2.js"
import {makeUserStates} from "./parts/make-user-states.js"
import {renderEditWidget} from "./parts/render-edit-widget.js"
import {renderOp} from "../../../framework/op-rendering/render-op.js"
import {makeAdministrativeModel} from "../models/administrative-model.js"
import {ModalSystem} from "../../../assembly/frontend/modal/types/modal-system.js"
import {ValueChangeEvent} from "../../xio-components/inputs/events/value-change-event.js"
import {validateUserSearchTerm} from "../api/services/validation/validate-user-search-term.js"
import {Component3WithShare, html, mixinStyles, property} from "../../../framework/component2/component2.js"

@mixinStyles(styles)
export class XiomeManageUsers extends Component3WithShare<{
		modals: ModalSystem
		administrativeModel: ReturnType<typeof makeAdministrativeModel>
	}> {

	@property()
	private userResults: Op<UserResult[]> = ops.ready([])

	private updateLocalUserResultsCache = {
		assignRole: (userId: string, roleId: string) => {
			if (!ops.ready(this.userResults)) throw new Error("error updating user cache")
			const userResults = ops.value(this.userResults)
			this.userResults = ops.ready(userResults.map(result =>
				result.user.userId === userId
					? {user: result.user, roleIds: [...result.roleIds, roleId]}
					: result
			))
		},
		revokeRole: (userId: string, roleId: string) => {
			if (!ops.ready(this.userResults)) throw new Error("error updating user cache")
			const userResults = ops.value(this.userResults)
			this.userResults = ops.ready(userResults.map(result =>
				result.user.userId === userId
					? {user: result.user, roleIds: result.roleIds.filter(id => id !== roleId)}
					: result
			))
		},
	}

	private userStates = makeUserStates({
		getUserResultsOp: () => this.userResults,
		rerender: () => this.requestUpdate(),
	})

	init() {
		this.share.administrativeModel.initialize()
	}

	@property({type: String})
	private searchText: string = ""

	private debouncedSearchUsers = debounce3(
		1000,
		async(term: string) =>
			term
				? await this.share.administrativeModel.searchUsers({term})
				: []
	)

	async search() {
		const {searchText} = this
		this.userResults = ops.ready([])

		if (searchText)
			await ops.operation({
				promise: this.debouncedSearchUsers(searchText),
				setOp: op => this.userResults = op,
			})
		else
			this.userResults = ops.ready([])

		this.userStates.cleanupObsoleteStates()
	}

	private searchChange = async(event: ValueChangeEvent<string>) => {
		this.searchText = event.detail.value ?? ""
		return this.search()
	}

	render() {
		const {permissionsOp} = this.share.administrativeModel.getState()

		const allowed = this.share.administrativeModel
			.isAllowed("administrate user roles")

		const renderUser = (userResult: UserResult) => {
			const {user} = userResult
			const state = this.userStates.obtainStateForUser(user.userId)
			return html`
				<li>
					<div class=userinfo>
						<xio-profile-card
							.user=${user}
							show-details
						></xio-profile-card>
						<div class=controls>
							<xio-button
								class=edit
								?data-edit-mode=${state.editMode}
								@press=${state.toggleEditMode}>
									${wrenchSvg}
							</xio-button>
						</div>
					</div>
					${state.editMode
						? renderOp(
							permissionsOp,
							permissions => renderEditWidget({
								userResult,
								permissions,
								administrativeModel: this.share.administrativeModel,
								updateLocalUserResultsCache: this.updateLocalUserResultsCache,
								blur: () => {
									const activeElement = <HTMLElement>document.activeElement
									if (activeElement)
										activeElement.blur()
								},
								search: () => this.search(),
							})
						)
						: null}
				</li>
			`
		}

		return html`
			<div class=container>

				${allowed ? html`
					<xio-text-input
						.text=${this.searchText}
						placeholder="search for users"
						.validator=${validateUserSearchTerm}
						@valuechange=${this.searchChange}
					></xio-text-input>

					<div class=results>
						${renderOp(this.userResults, results => results.length > 0
							? html`
								<ol class=userlist>
									${results.map(renderUser)}
								</ol>
							`
							: html`
								<div class=noresults>
									no results
								</div>
							`
						)}
					</div>
				` : html`
					<p>you are not permitted to administrate user roles</p>
				`}

			</div>
		`
	}
}
