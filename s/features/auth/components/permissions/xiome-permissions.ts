
import styles from "./xiome-permissions.css.js"
import {AuthModel} from "../../types/auth-model.js"
import {makePermissionsModel} from "../../models/permissions-model.js"
import {RoleDisplay} from "../../topics/permissions/types/role-display.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {PermissionsDisplay} from "../../topics/permissions/types/permissions-display.js"
import {roleLabelValidator} from "../../topics/permissions/validators/role-label-validator.js"
import {WiredComponent, mixinStyles, html, property} from "../../../../framework/component.js"
import {renderWrappedInLoading} from "../../../../framework/loading/render-wrapped-in-loading.js"

@mixinStyles(styles)
export class XiomePermissions extends WiredComponent<{
		modals: ModalSystem
		authModel: AuthModel
		permissionsModel: ReturnType<typeof makePermissionsModel>
	}> {

	firstUpdated() {
		this.share.permissionsModel.load()
	}

	@property()
	private roleSelected: RoleDisplay

	private clickRole = (role: RoleDisplay) => () => {
		this.roleSelected = role
	}

	private getAssignedPrivileges(permissions: PermissionsDisplay) {
		const {roleSelected} = this
		if (!roleSelected) return null

		const assignedPrivilegeIds = permissions.rolesHavePrivileges
			.filter(({roleId}) => roleId === roleSelected.roleId)
			.map(({privilegeId}) => privilegeId)

		return permissions.privileges
			.filter(({privilegeId}) =>
				assignedPrivilegeIds.includes(privilegeId))
			.map(privilege => {
				const {hard} = permissions.rolesHavePrivileges.find(
					rp => rp.roleId === roleSelected.roleId &&
						rp.privilegeId === privilege.privilegeId
				)
				return {...privilege, hard}
			})
	}

	private clickNewRole = async() => {
		const {modals, permissionsModel} = this.share
		const result = await modals.prompt<string>({
			title: "enter a name for your new custom role",
			input: {
				label: "role name",
				validator: roleLabelValidator,
			},
		})
		if (result)
			await permissionsModel.createRole(result.value)
	}

	private clickAvailablePrivilege = (privilegeId: string) => async() => {
		const {roleSelected} = this
		if (roleSelected)
			await this.share.permissionsModel.assignPrivilege({
				privilegeId,
				roleId: roleSelected.roleId,
			})
	}

	private clickAssignedPrivilege = (privilegeId: string) => async() => {
		const {roleSelected} = this
		if (roleSelected)
			await this.share.permissionsModel.unassignPrivilege({
				privilegeId,
				roleId: roleSelected.roleId,
			})
	}

	private renderPermissions(permissions: PermissionsDisplay) {
		const assignedPrivileges = this.getAssignedPrivileges(permissions)
		const availablePrivileges = this.roleSelected
			? permissions.privileges
				.filter(privilege => !assignedPrivileges
					.find(priv => priv.privilegeId === privilege.privilegeId)
				)
			: permissions.privileges
		return html`
			<div class=container>
				<div class=roles>
					<p>roles</p>
					<div part=plate>
						${permissions.roles.map(role => html`
							<xio-button
								?data-hard=${role.hard}
								title="${role.roleId}"
								?disabled=${this.roleSelected &&
									role.roleId === this.roleSelected.roleId}
								@click=${this.clickRole(role)}>
									${role.label}
							</xio-button>
						`)}
					</div>
					<div part=plate class=buttonbar>
						<xio-button class=buttonbar @press=${this.clickNewRole}>
							new role
						</xio-button>
					</div>
				</div>

				<div class=assigned>
					<p>
						privileges assigned
						${this.roleSelected
							? ` to "${this.roleSelected.label}"`
							: null
						}
					</p>
					<div part=plate>
						${assignedPrivileges &&
							assignedPrivileges.map(({privilegeId, label, hard}) => html`
								<xio-button
									title="${privilegeId}"
									?data-hard=${hard}
									@press=${this.clickAssignedPrivilege(privilegeId)}>
									${label}
								</xio-button>
							`)}
					</div>
				</div>

				<div class=available>
					<p>privileges available</p>
					<div part=plate>
						${availablePrivileges.map(({privilegeId, label, hard}) => html`
							<xio-button
								title="${privilegeId}"
								?data-hard=${hard}
								@press=${this.clickAvailablePrivilege(privilegeId)}>
									${label}
							</xio-button>
						`)}
					</div>
				</div>
			</div>
		`
	}

	render() {
		const {permissionsLoadingView} = this.share.permissionsModel
		return renderWrappedInLoading(
			permissionsLoadingView,
			this.renderPermissions.bind(this),
		)
	}
}
