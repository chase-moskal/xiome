
import styles from "./xiome-permissions.css.js"
import {AuthModel} from "../../types/auth-model.js"
import {makePermissionsModel} from "../../models/permissions-model.js"
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

	render() {
		const {permissionsLoadingView} = this.share.permissionsModel
		return renderWrappedInLoading(permissionsLoadingView, permissions => html`
			<div class=container>
				<div class=roles>
					<p>roles</p>
					<div part=plate>
						${permissions.roles.map(role => html`
							<xio-button
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
						${(() => {
							const {roleSelected} = this
							if (!roleSelected) return null
	
							const assignedPrivilegeIds = permissions.rolesHavePrivileges
								.filter(({roleId}) => roleId === roleSelected.roleId)
								.map(({privilegeId}) => privilegeId)

							const assignedPrivileges = permissions.privileges
								.filter(({privilegeId}) =>
									assignedPrivilegeIds.includes(privilegeId))

							return assignedPrivileges.map(({privilegeId, label}) => html`
								<xio-button title="${privilegeId}">
									${label}
								</xio-button>
							`)
						})()}
					</div>
				</div>
				<div class=available>
					<p>privileges available</p>
					<div part=plate>
						...
					</div>
				</div>
			</div>
		`)
	}
}
