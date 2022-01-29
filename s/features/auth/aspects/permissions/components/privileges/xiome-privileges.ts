
import styles from "./xiome-privileges.css.js"

import {renderPrivilege} from "./parts/render-privilege.js"
import {makePermissionsModel} from "../../models/permissions-model.js"
import {renderOp} from "../../../../../../framework/op-rendering/render-op.js"
import {validatePermissionsLabel} from "../../tools/permissions-validators.js"
import {XioTextInput} from "../../../../../xio-components/inputs/xio-text-input.js"
import {ModalSystem} from "../../../../../../assembly/frontend/modal/types/modal-system.js"
import {PrivilegeDisplay} from "../../../users/routines/permissions/types/privilege-display.js"
import {ValueChangeEvent} from "../../../../../xio-components/inputs/events/value-change-event.js"
import {mixinStyles, html, Component, mixinRequireShare} from "../../../../../../framework/component.js"

@mixinStyles(styles)
export class XiomePrivileges extends mixinRequireShare<{
		modals: ModalSystem
		permissionsModel: ReturnType<typeof makePermissionsModel>
	}>()(Component) {

	get model() {
		return this.share.permissionsModel
	}

	init() {
		this.model.initialize()
	}

	#busy = false

	#clearCreatorTextInput() {
		const input = this.shadowRoot.querySelector<XioTextInput>(".creator xio-text-input")
		input.text = ""
	}

	async #createPrivilege() {
		if (this.#busy)
			throw new Error("privilege creator is busy")
		const label = this.#labelDraft
		this.#clearCreatorTextInput()
		this.#busy = true
		try {
			await this.model.createPrivilege({label})
		}
		finally {
			this.#busy = false
		}
	}

	async #deletePrivilege({privilegeId, label}: PrivilegeDisplay) {
		const confirm = await this.share.modals.confirm({
			title: html`delete privilege ${label}?`,
			body: html`are you sure you want to delete this privilege?`,
		})
		if (confirm)
			await this.model.deletePrivilege({privilegeId})
	}

	#labelDraft: string

	#handleCreatorLabelChange = (event: ValueChangeEvent<string>) => {
		this.#labelDraft = event.detail.value
		this.requestUpdate()
	}

	#renderPrivilegeCreator() {
		const isCreateButtonDisabled = !this.#labelDraft
		return html`
			<div class=creator>
				<xio-text-input
					?disabled=${this.#busy}
					.validator=${validatePermissionsLabel}
					@valuechange=${this.#handleCreatorLabelChange}
					@enterpress=${this.#createPrivilege}>
						privilege label
				</xio-text-input>
				<xio-button
					?disabled=${isCreateButtonDisabled}
					@press=${this.#createPrivilege}>
						create privilege
				</xio-button>
			</div>
		`
	}

	render() {
		const {readable: {permissionsDisplay}} = this.model
		const allowed = this.model.getUserCanCustomizePermissions()
		return renderOp(permissionsDisplay, permissions => allowed ? html`
			<div class=privileges>
				${this.#renderPrivilegeCreator()}
				${permissions.privileges.map(
					privilege => renderPrivilege({
						privilege,
						onDeleteClick: () => this.#deletePrivilege(privilege)
					})
				)}
			</div>
		` : html`
			<p>you are not permitted to customize privileges</p>
		`)
	}
}
