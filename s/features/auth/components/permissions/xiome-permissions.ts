
import styles from "./xiome-permissions.css.js"
import {AuthModel} from "../../types/auth-model.js"
import {makePermissionsModel} from "../../models/permissions-model.js"
import {PermissionsDisplay} from "../../topics/permissions/types/permissions-display.js"
import {WiredComponent, mixinStyles, html, property} from "../../../../framework/component.js"
import {renderWrappedInLoading} from "../../../../framework/loading/render-wrapped-in-loading.js"

interface Role {
	roleId: string
	label: string
}

@mixinStyles(styles)
export class XiomePermissions extends WiredComponent<{
		authModel: AuthModel
		permissionsModel: ReturnType<typeof makePermissionsModel>
	}> {

	firstUpdated() {
		this.share.permissionsModel.load()
	}

	@property()
	private roleSelected: Role

	private clickRole = (role: Role) => () => {
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
								?disabled=${
									this.roleSelected &&
										role.roleId === this.roleSelected.roleId
								}
								@click=${this.clickRole(role)}>
									${role.label}
							</xio-button>
						`)}
					</div>
					<div part=plate class=buttonbar>
						<xio-button class=buttonbar>
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
								<xio-button title="${privilegeId}" ?data-hard=${hard}>
									${label}
								</xio-button>
							`)}
					</div>
				</div>
				<div class=available>
					<p>privileges available</p>
					<div part=plate>
						${availablePrivileges.map(({privilegeId, label, hard}) => html`
							<xio-button title="${privilegeId}" ?data-hard=${hard}>
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
