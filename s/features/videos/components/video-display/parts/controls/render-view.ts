
import {VideoView} from "../../../../types/video-concepts.js"
import {html} from "../../../../../../framework/component/component.js"
import {PrivilegeDisplay} from "../../../../../auth/aspects/users/routines/permissions/types/privilege-display.js"

export function renderView({view, onDeleteClick, getPrivilegeDisplay}: {
		view: VideoView
		onDeleteClick: () => void
		getPrivilegeDisplay: (id: string) => void | PrivilegeDisplay
	}) {
	return html`
		<div class="view">
			<p>label: ${view.label}</p>
			<p>provider: ${view.provider}</p>
			<p>type: ${view.type}</p>
			<p>id: ${view.id}</p>
			<p>privileges:</p>
			<ul>
				${view.privileges.map(getPrivilegeDisplay)
					.map(privilege => privilege ? html`
						<li>${privilege.label}</li>
					` : null)
				}
			</ul>
			<xio-button @press=${onDeleteClick}>delete view</xio-button>
		</div>
	`
}
