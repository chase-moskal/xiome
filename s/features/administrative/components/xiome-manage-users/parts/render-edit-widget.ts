
import {UserResult} from "../../../api/types/user-result.js"
import {html} from "../../../../../framework/component.js"
import {makeAdministrativeModel} from "../../../models/administrative-model.js"
import {RoleDisplay} from "../../../../auth/aspects/users/routines/permissions/types/role-display.js"
import {PrivilegeDisplay} from "../../../../auth/aspects/users/routines/permissions/types/privilege-display.js"
import {PermissionsDisplay} from "../../../../auth/aspects/users/routines/permissions/types/permissions-display.js"

function sortAssignableFirst(roles: RoleDisplay[]) {
	const assignable = roles.filter(role => role.assignable)
	const notAssignable = roles.filter(role => !role.assignable)
	return [...assignable, ...notAssignable]
}

function renderRoleButton(role: RoleDisplay, onClick: (role: RoleDisplay) => any) {
	return html`
		<xio-button
			?disabled=${!role.assignable}
			title=${role.roleId}
			data-role-id=${role.roleId}
			@press=${() => onClick(role)}>
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
		permissions,
		administrativeModel,
		updateLocalUserResultsCache,
		userResult: {user: {userId}, roleIds},
		blur,
		search,
	}: {
		userResult: UserResult
		permissions: PermissionsDisplay
		administrativeModel: ReturnType<typeof makeAdministrativeModel>
		updateLocalUserResultsCache: {
			assignRole: (userId: string, roleId: string) => void
			revokeRole: (userId: string, roleId: string) => void
		}
		blur: () => void
		search: () => Promise<any>
	}) {

	const rolesAssigned = sortAssignableFirst(
		roleIds
			.map(id => permissions.roles.find(role => role.roleId === id))
			.filter(id => !!id)
	)

	const rolesAvailable = sortAssignableFirst(
		permissions.roles
			.filter(role => !roleIds.includes(role.roleId))
			.filter(id => !!id)
	)

	const privilegesUserHas = permissions.privileges
		.filter(privilege => {
			const rolesWithThisPrivilege = permissions.rolesHavePrivileges
				.filter(r => r.active && r.privilegeId === privilege.privilegeId)
			const rolesUserHas = rolesWithThisPrivilege
				.filter(r => roleIds.includes(r.roleId))
			return rolesUserHas.length > 0
		})

	async function ifChangingSelfThenReauthorize() {
		if (userId === administrativeModel.getAccess()?.user?.userId)
			await administrativeModel.reauthorize()
	}

	async function clickToAssign({roleId}: RoleDisplay) {
		await administrativeModel.assignRoleToUser({
			userId,
			roleId,
			isPublic: true,
			timeframeEnd: undefined,
			timeframeStart: undefined,
		})
		updateLocalUserResultsCache.assignRole(userId, roleId)
		blur()
		await ifChangingSelfThenReauthorize()
		await search()
	}

	async function clickToRevoke({roleId}: RoleDisplay) {
		await administrativeModel.revokeRoleFromUser({
			userId,
			roleId,
		})
		updateLocalUserResultsCache.revokeRole(userId, roleId)
		blur()
		await ifChangingSelfThenReauthorize()
		await search()
	}

	return html`
		<div class=editwidget>
			<div class=available>
				<header>roles available <small>(click to assign)</small></header>
				<div>
					${rolesAvailable.map(role => renderRoleButton(role, clickToAssign))}
				</div>
			</div>
			<div class=assigned>
				<header>roles assigned <small>(click to revoke)</small></header>
				<div>
					${rolesAssigned.map(role => renderRoleButton(role, clickToRevoke))}
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
