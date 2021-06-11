
import {EditWidget} from "../types/edit-widget.js"
import {UserResult} from "../../api/types/user-result.js"
import {html} from "../../../../framework/component2/component2.js"
import {PermissionsDisplay} from "../../../auth/topics/permissions/types/permissions-display.js"
import {RoleDisplay} from "../../../auth/topics/permissions/types/role-display.js"
import {PrivilegeDisplay} from "../../../auth/topics/permissions/types/privilege-display.js"

function sortAssignableFirst(roles: RoleDisplay[]) {
	const assignable = roles.filter(role => role.assignable)
	const notAssignable = roles.filter(role => !role.assignable)
	return [...assignable, ...notAssignable]
}

function renderRoleButton(role: RoleDisplay) {
	return html`
		<xio-button
			?disabled=${!role.assignable}
			title=${role.roleId}
			data-role-id=${role.roleId}>
				${role.label}
		</xio-button>
	`
}

function renderPrivilegeUserHas(privilege: PrivilegeDisplay) {
	return html`
		<li
			title="${privilege.privilegeId}"
			data-privilege-id="${privilege.privilegeId}">
				${privilege.label}
		</li>
	`
}

export function renderEditWidget({
		editWidget,
		permissions,
		userResult: {roleIds},
	}: {
		userResult: UserResult
		editWidget: EditWidget
		permissions: PermissionsDisplay
	}) {

	const rolesAssigned = sortAssignableFirst(
		roleIds
			.map(id => permissions.roles.find(role => role.roleId === id))
	)

	const rolesAvailable = sortAssignableFirst(
		permissions.roles
			.filter(role => !roleIds.includes(role.roleId))
	)

	const privilegesUserHas = permissions.privileges
		.filter(privilege => {
			const rolesWithThisPrivilege = permissions.rolesHavePrivileges
				.filter(r => r.active && r.privilegeId === privilege.privilegeId)
			const rolesUserHas = rolesWithThisPrivilege
				.filter(r => roleIds.includes(r.roleId))
			return rolesUserHas.length > 0
		})

	return html`
		<div class=editwidget>
			<div class=available>
				<header>roles available <small>(click to assign)</small></header>
				<div>
					${rolesAvailable.map(renderRoleButton)}
				</div>
			</div>
			<div class=assigned>
				<header>roles assigned <small>(click to revoke)</small></header>
				<div>
					${rolesAssigned.map(renderRoleButton)}
				</div>
			</div>
			<div class=allprivileges>
				<header>user has these privileges</header>
				<ul>
					${privilegesUserHas.map(renderPrivilegeUserHas)}
				</ul>
			</div>
		</div>
	`
}
