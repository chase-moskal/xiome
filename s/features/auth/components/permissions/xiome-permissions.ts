
import styles from "./xiome-permissions.css.js"
import lockSvg from "../../../../framework/icons/lock.svg.js"
import wrenchSvg from "../../../../framework/icons/wrench.svg.js"

import {AuthModel} from "../../models/types/auth/auth-model.js"
import {makePermissionsModel} from "../../models/permissions-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {RoleDisplay} from "../../topics/permissions/types/role-display.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {PermissionsDisplay} from "../../topics/permissions/types/permissions-display.js"
import {roleLabelValidator} from "../../topics/permissions/validators/role-label-validator.js"
import {mixinStyles, html, property, Component3WithShare} from "../../../../framework/component2/component2.js"

@mixinStyles(styles)
export class XiomePermissions extends Component3WithShare<{
		modals: ModalSystem
		authModel: AuthModel
		permissionsModel: ReturnType<typeof makePermissionsModel>
	}> {

	init() {
		this.share.permissionsModel.initialize()
	}

	@property()
	private roleSelected: RoleDisplay

	private clickRole = (role: RoleDisplay) => () => {
		this.roleSelected = role
	}

	private getAssignedPrivileges(permissions: PermissionsDisplay) {
		const {roleSelected} = this
		if (!roleSelected) return []

		const assignedPrivilegeIds = permissions.rolesHavePrivileges
			.filter(({id_role}) => id_role === roleSelected.id_role)
			.map(({id_privilege}) => id_privilege)

		return permissions.privileges
			.filter(({id_privilege}) =>
				assignedPrivilegeIds.includes(id_privilege))
			.map(privilege => {
				const {active, immutable} = permissions.rolesHavePrivileges.find(
					rp => rp.id_role === roleSelected.id_role &&
						rp.id_privilege === privilege.id_privilege
				)
				return {...privilege, active, immutable}
			})
	}

	private clickDeleteRole = async() => {
		const {modals, permissionsModel} = this.share
		const role = this.roleSelected
		const confirmed = await modals.confirm({
			title: "Delete role?",
			body: `Are you sure you want to permanently delete the role "${role.label}"`,
			yes: {vibe: "negative", label: "Delete role"},
			no: {vibe: "neutral", label: "Nevermind"},
			focusNthElement: 2,
		})
		if (confirmed)
			await permissionsModel.deleteRole({id_role: role.id_role})
	}

	private clickNewRole = async() => {
		const {modals, permissionsModel} = this.share
		const result = await modals.prompt<string>({
			title: "Create a new role",
			input: {
				label: "Role name",
				validator: roleLabelValidator,
			},
			yes: {vibe: "positive", label: "Create role"}
		})
		if (result)
			await permissionsModel.createRole({label: result.value})
	}

	private clickAvailablePrivilege = (id_privilege: string) => async() => {
		const {roleSelected} = this
		if (roleSelected)
			await this.share.permissionsModel.assignPrivilege({
				id_privilege,
				id_role: roleSelected.id_role,
			})
	}

	private clickAssignedPrivilege = (id_privilege: string) => async() => {
		const {roleSelected} = this
		if (roleSelected)
			await this.share.permissionsModel.unassignPrivilege({
				id_privilege,
				id_role: roleSelected.id_role,
			})
	}

	private renderPrivilege({
			id_privilege,
			label,
			hard,
			immutable,
			onPrivilegeClick,
		}: {
			id_privilege: string
			label: string
			hard: boolean
			immutable: boolean
			onPrivilegeClick: () => void
		}) {
		return html`
			<xio-button
				title="${id_privilege}"
				?disabled=${immutable}
				?data-hard=${hard}
				?data-soft=${!hard}
				?data-immutable=${immutable}
				@press=${onPrivilegeClick}>
					<div>
						${immutable
							? html`<div class=icon>${lockSvg}</div>`
							: null}
						${label}
					</div>
			</xio-button>
		`
	}

	private renderPermissions(permissions: PermissionsDisplay) {
		const assignedPrivileges = this.getAssignedPrivileges(permissions)
		const activePrivileges = assignedPrivileges.filter(p => p.active)
		const availablePrivileges = this.roleSelected
			? [
				...permissions.privileges
					.filter(privilege => {
						const assigned = assignedPrivileges
							.find(priv => priv.id_privilege === privilege.id_privilege)
						return !assigned
					})
					.map(privilege => ({...privilege, immutable: false})),
				...assignedPrivileges
					.filter(privilege => !privilege.active)
			]
			: []
		return html`
			<div class=container>
				<div class=roles>
					<p>roles</p>
					<div part=plate>
						${permissions.roles.map(role => html`
							<xio-button
								title="${role.id_role}"
								?data-selected=${
									this.roleSelected &&
									role.id_role === this.roleSelected.id_role
								}
								?data-hard=${role.hard}
								?disabled=${
									this.roleSelected &&
									role.id_role === this.roleSelected.id_role
								}
								@click=${this.clickRole(role)}>
								<div>
									${role.hard
										? html`<div class=icon>${wrenchSvg}</div>`
										: null}
									${role.label}
								</div>
							</xio-button>
						`)}
					</div>
					<div part=plate class=buttonbar>
						${this.roleSelected
							? html`
								<xio-button
									data-button=delete
									?disabled=${this.roleSelected.hard}
									@press=${this.clickDeleteRole}>
										delete role
								</xio-button>
							`
							: null}
						<xio-button data-button=new @press=${this.clickNewRole}>
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
						${activePrivileges.map(privilege => this.renderPrivilege({
								...privilege,
								onPrivilegeClick:
									this.clickAssignedPrivilege(privilege.id_privilege)
							}))}
					</div>
				</div>

				<div class=available>
					<p>privileges available</p>
					<div part=plate>
						${availablePrivileges.map(privilege => this.renderPrivilege({
							...privilege,
							onPrivilegeClick: this.clickAvailablePrivilege(privilege.id_privilege),
						}))}
					</div>
				</div>
			</div>
		`
	}

	render() {
		const {permissionsModel} = this.share
		const {getUserCanCustomizePermissions, getState} = permissionsModel
		const state = getState()
		return getUserCanCustomizePermissions()
			? renderOp(
				state.permissionsDisplay,
				this.renderPermissions.bind(this),
			)
			: html`
				<p>you are not privileged to customize permissions</p>
			`
	}
}
