
import styles from "./xiome-manage-users.css.js"
import wrenchSvg from "../../../framework/icons/wrench.svg.js"

import {User} from "../../auth/types/user.js"
import {Op, ops} from "../../../framework/ops.js"
import {debounce3} from "../../../toolbox/debounce2.js"
import {makeUserStates} from "./parts/make-user-states.js"
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
	private users: Op<User[]> = ops.ready([])

	private userStates = makeUserStates({
		getUsersOp: () => this.users,
		requestUpdate: () => this.requestUpdate(),
	})

	init() {
		this.share.administrativeModel.initialize()
	}

	private searchForUsers = debounce3(
		1000,
		async(term: string) =>
			term
				? this.share.administrativeModel.searchForUsers({term})
				: []
	)

	private searchChange = async(event: ValueChangeEvent<string>) => {
		const {value} = event.detail
		this.users = ops.ready([])
		if (value)
			await ops.operation({
				promise: this.searchForUsers(value),
				setOp: op => this.users = op,
			})
		else
			this.users = ops.ready([])
		this.userStates.cleanupObsoleteStates()
	}

	render() {
		const {permissionsOp} = this.share.administrativeModel.getState()
		const {isAllowed} = this.share.administrativeModel

		const renderUser = (user: User) => {
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
								?disabled=${!isAllowed["assign roles"]}
								?data-edit-mode=${!!state.editWidget}
								@press=${state.toggleEditWidget}>
									${wrenchSvg}
							</xio-button>
						</div>
					</div>
					${isAllowed["assign roles"] && state.editWidget
						? renderOp(permissionsOp, permissions => html`
							<div class=editwidget>
								role editing widget
							</div>
						`)
						: null}
				</li>
			`
		}

		return html`
			<div class=container>

				${isAllowed("search users") ? html`
					<xio-text-input
						placeholder="search for users"
						.validator=${validateUserSearchTerm}
						@valuechange=${this.searchChange}
					></xio-text-input>

					<div class=results>
						${renderOp(this.users, users => users.length > 0
							? html`
								<ol class=userlist>
									${users.map(renderUser)}
								</ol>
							`
							: html`
								<div class=noresults>no results</div>
							`
						)}
					</div>
				` : html`
					<p>no permissions for user search</p>
				`}

			</div>
		`
	}
}
