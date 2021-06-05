
import styles from "./xiome-manage-users.css.js"

import {debounce2, debounce3} from "../../../toolbox/debounce2.js"
import {makeAdministrativeModel} from "../models/administrative-model.js"
import {ModalSystem} from "../../../assembly/frontend/modal/types/modal-system.js"
import {ValueChangeEvent} from "../../xio-components/inputs/events/value-change-event.js"
import {validateUserSearchTerm} from "../api/services/validation/validate-user-search-term.js"
import {Component2WithShare, html, mixinStyles, property} from "../../../framework/component2/component2.js"
import {onesie} from "../../../toolbox/onesie.js"
import {User} from "../../auth/types/user.js"
import {Op, ops} from "../../../framework/ops.js"
import {renderOp} from "../../../framework/op-rendering/render-op.js"

@mixinStyles(styles)
export class XiomeManageUsers extends Component2WithShare<{
		modals: ModalSystem
		administrativeModel: ReturnType<typeof makeAdministrativeModel>
	}> {

	@property()
	private users: Op<User[]> = ops.ready([])

	private searchForUsers = debounce3(
		1000,
		onesie(
			async(term: string) =>
				term
					? this.share.administrativeModel.searchForUsers({term})
					: []
		)
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

	render() {
		return html`
			<xio-text-input
				placeholder="search for users"
				.validator=${validateUserSearchTerm}
				@valuechange=${this.searchChange}
			></xio-text-input>
			<ol class=userlist>
				${renderOp(this.users, users => users.length > 0
					? users.map(user => html`
						<li>
							<xio-profile-card .user=${user} show-details></xio-profile-card>
						</li>
					`)
					: "no results")}
			</ol>
		`
	}
}
