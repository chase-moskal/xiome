
import styles from "./xiome-privileges.css.js"

import {renderPrivilege} from "./parts/render-privilege.js"
import {makePermissionsModel} from "../../models/permissions-model.js"
import {renderOp} from "../../../../../../framework/op-rendering/render-op.js"
import {ModalSystem} from "../../../../../../assembly/frontend/modal/types/modal-system.js"
import {PrivilegeDisplay} from "../../../users/routines/permissions/types/privilege-display.js"
import {mixinStyles, html, ComponentWithShare} from "../../../../../../framework/component/component.js"

@mixinStyles(styles)
export class XiomePrivileges extends ComponentWithShare<{
		modals: ModalSystem
		permissionsModel: ReturnType<typeof makePermissionsModel>
	}> {

	get model() {
		return this.share.permissionsModel
	}

	init() {
		this.model.initialize()
	}

	async #deletePrivilege({privilegeId, label}: PrivilegeDisplay) {
		const confirm = await this.share.modals.confirm({
			title: html`delete privilege ${label}?`,
			body: html`are you sure you want to delete this privilege?`,
		})
		if (confirm)
			await this.model.deletePrivilege({privilegeId})
	}

	render() {
		const {readable: {permissionsDisplay}} = this.model
		const allowed = this.model.getUserCanCustomizePermissions()
		return renderOp(permissionsDisplay, permissions => allowed ? html`
			<div class=privileges>
				${permissions.privileges.map(
					privilege => renderPrivilege({
						privilege,
						onDeleteClick: () => this.#deletePrivilege(privilege)
					})
				)}
			</div>
			<div class=create>
				<xio-text-input
					>
						privilege label
				</xio-text-input>
				<xio-button>
					create privilege
				</xio-button>
			</div>
		` : html`
			<p>you are not permitted to customize privileges</p>
		`)
	}
}
