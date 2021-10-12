
import wrench from "../../../../../../../framework/icons/wrench.svg.js"
import cancelSvg from "../../../../../../../framework/icons/cancel.svg.js"

import {html} from "../../../../../../../framework/component.js"
import {PrivilegeDisplay} from "../../../../users/routines/permissions/types/privilege-display.js"

export function renderPrivilege({
		privilege: {hard, label, privilegeId},
		onDeleteClick,
	}: {
		privilege: PrivilegeDisplay
		onDeleteClick: () => void
	}) {

	function renderSystemIcon() {
		return html`
			<div class="icon system">
				${wrench}
			</div>
		`
	}

	function renderDeleteButton() {
		return html`
			<xio-button
				title="delete privilege"
				class="icon delete"
				@press=${onDeleteClick}>
					${cancelSvg}
			</xio-button>
		`
	}

	return html`
		<div
			class=privilege
			?data-hard=${hard}>
				${hard ? renderSystemIcon() : renderDeleteButton()}
				<span class=text>${label}</span>
		</div>
	`
}
