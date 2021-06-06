
import styles from "./xiome-manage-users.css.js"

import {User} from "../../auth/types/user.js"
import {Op, ops} from "../../../framework/ops.js"
import {debounce3} from "../../../toolbox/debounce2.js"
import {renderOp} from "../../../framework/op-rendering/render-op.js"
import {makeAdministrativeModel} from "../models/administrative-model.js"
import {whenOpReady} from "../../../framework/op-rendering/when-op-ready.js"
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

	init() {
		this.share.administrativeModel.loadPermissions()
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
	}

	// TODO implement state for role assignment widget for each user
	private userStates = new Map<string, {}>()

	render() {
		const {permissionsOp} = this.share.administrativeModel.getState()

		function renderUser() {}

		return html`
			<div class=container>

				<xio-text-input
					placeholder="search for users"
					.validator=${validateUserSearchTerm}
					@valuechange=${this.searchChange}
				></xio-text-input>

				<div class=results>
					${renderOp(this.users, users => users.length > 0
						? html`
							<ol class=userlist>
								${users.map(user => html`
									<li>
										<xio-profile-card
											.user=${user}
											show-details
										></xio-profile-card>
										<div class=controls>
											<xio-button class=edit></xio-button>
										</div>
									</li>
								`)}
							</ol>
						`
						: html`
							<div class=noresults>no results</div>
						`
					)}
				</div>
			</div>
		`
	}
}
