
import {User} from "../../../auth/aspects/users/types/user.js"
import {html} from "../../../../framework/component.js"

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
