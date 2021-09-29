
import lockSvg from "../../../../../../../framework/icons/lock.svg.js"
import cancelSvg from "../../../../../../../framework/icons/cancel.svg.js"

import {html} from "../../../../../../../framework/component/component.js"
import {PrivilegeDisplay} from "../../../../users/routines/permissions/types/privilege-display.js"

export function renderPrivilege({
		privilege: {hard, label, privilegeId},
		onDeleteClick,
	}: {
		privilege: PrivilegeDisplay
		onDeleteClick: () => void
	}) {

	function renderLockedIcon() {
		return html`
			<div class="icon locked">
				${lockSvg}
			</div>
		`
	}

	function renderDeleteButton() {
		return html`
			<xio-button @press=${onDeleteClick}>
				${cancelSvg}
			</xio-button>
		`
	}

	return html`
		<div class=privilege title="${privilegeId}">
			${hard ? renderLockedIcon() : renderDeleteButton()}
			<span class=text>${label}</span>
		</div>
	`
}
