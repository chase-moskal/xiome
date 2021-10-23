
import {VideoView} from "../../../../types/video-concepts.js"
import {html} from "../../../../../../framework/component.js"
import {PrivilegeDisplay} from "../../../../../auth/aspects/users/routines/permissions/types/privilege-display.js"
import { XioId } from "../../../../../xio-components/id/xio-id.js"
export function renderView({view, onDeleteClick, getPrivilegeDisplay}: {
		view: VideoView
		onDeleteClick: () => void
		getPrivilegeDisplay: (id: string) => void | PrivilegeDisplay
	}) {
	return html`
		<div class="view">
			<div class="flex-box">
			<div class="box"><p>Hosting provider:</p>
			<p>${view.provider}</p>
			</div>
			<div class="box">
			<p>Content type:</p>
			<p>${view.type}</p>
			</div>
			<div class="box">
			<p>Content id:</p>
			<xio-id id="${view.id}"></xio-id>
			</div>
			</div>
			
			<p>Privileges with access:</p>
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
