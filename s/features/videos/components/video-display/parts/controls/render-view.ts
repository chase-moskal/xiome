
import {VideoView} from "../../../../types/video-concepts.js"
import {html} from "../../../../../../framework/component.js"
import {PrivilegeDisplay} from "../../../../../auth/aspects/users/routines/permissions/types/privilege-display.js"

export function renderView({view, onDeleteClick, getPrivilegeDisplay}: {
		view: VideoView
		onDeleteClick: () => void
		getPrivilegeDisplay: (id: string) => void | PrivilegeDisplay
	}) {
	return html`
		<div class="view">
			<div class="view-details">
				<div>
					<h4>hosting provider</h4>
					<p>${view.provider}</p>
				</div>
				<div>
					<h4>content type</h4>
					<p>${view.type}</p>
				</div>
				<div>
					<h4>content id</h4>
					<xio-id id="${view.id}"></xio-id>
				</div>
			</div>
			<h4>privileges with access</h4>
			<ul>
				${view.privileges.map(getPrivilegeDisplay)
					.map(privilege => privilege
						? html`<li>${privilege.label}</li>`
						: null)
				}
			</ul>
			<div class=buttonbar>
			<xio-button @press=${onDeleteClick}>
				unassign from this display
			</xio-button>
			</div>
		</div>
	`
}
