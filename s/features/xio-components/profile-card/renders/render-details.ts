
import {User} from "../../../auth/aspects/users/types/user.js"
import {html} from "../../../../framework/component.js"
import {formatDate} from "../../../../toolbox/goodtimes/format-date.js"

export function renderDetails(user: User) {
	return html`
		<ul part=details>
			<li>
				<span>joined:</span>
				<span>${formatDate(user.stats.joined).date}</span>
			</li>
			<li>
				<span>user id:</span>
				<span><xio-id id="${user.userId}"></xio-id></span>
			</li>
		</ul>
	`
}
