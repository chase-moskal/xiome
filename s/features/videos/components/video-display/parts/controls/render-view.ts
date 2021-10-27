
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
			<div class="view-box">
				<div class="box"><h4>Hosting provider:</h4>
					<p>${view.provider}</p>
				</div>
				<div class="box">
					<h4>Content type:</h4>
					<p>${view.type}</p>
				</div>
				<div class="box">
					<h4>Content id:</h4>
					<xio-id id="${view.id}"></xio-id>
				</div>
			</div>
			
			<h4>Privileges with access:</h4>
			<ul>
				${view.privileges.map(getPrivilegeDisplay)
					.map(privilege => privilege ? html`
						<li>${privilege.label}</li>
					` : null)
				}
			</ul>
			<div class="xio-box">
			<xio-button @press=${onDeleteClick}>unassign from this display</xio-button>
			</div>
		</div>
	`
}
