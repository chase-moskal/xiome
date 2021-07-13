
import {User} from "../../../auth/types/user.js"
import {html} from "../../../../framework/component2/component2.js"

export function renderRoles(user: User) {
	return html`
		<ul class=roles>
			${user.roles.map(role => html`
				<li
					data-role-label="${role.label}"
					data-role-id="${role.roleId}">
						${role.label}
				</li>
			`)}
		</ul>
	`
}
