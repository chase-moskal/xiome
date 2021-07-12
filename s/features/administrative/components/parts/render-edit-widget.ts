
import {UserResult} from "../../api/types/user-result.js"
import {html} from "../../../../framework/component2/component2.js"
import {PermissionsDisplay} from "../../../auth/topics/permissions/types/permissions-display.js"
import {RoleDisplay} from "../../../auth/topics/permissions/types/role-display.js"
import {PrivilegeDisplay} from "../../../auth/topics/permissions/types/privilege-display.js"
import {makeAdministrativeModel} from "../../models/administrative-model.js"

function sortAssignableFirst(roles: RoleDisplay[]) {
	const assignable = roles.filter(role => role.assignable)
	const notAssignable = roles.filter(role => !role.assignable)
	return [...assignable, ...notAssignable]
}

function renderRoleButton(role: RoleDisplay, onClick: (role: RoleDisplay) => any) {
	return html`
		<xio-button
			?disabled=${!role.assignable}
			title=${role.id_role}
			data-role-id=${role.id_role}
			@press=${() => onClick(role)}>
				${role.label}
		</xio-button>
	`
}

function renderPrivilegeUserHas(privilege: PrivilegeDisplay) {
	return html`
		<li
			title="${privilege.id_privilege}"
			data-privilege-id="${privilege.id_privilege}">
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
			assignRole: (userId: string, id_role: string) => void
			revokeRole: (userId: string, id_role: string) => void
		}
		blur: () => void
		search: () => Promise<any>
	}) {

	const rolesAssigned = sortAssignableFirst(
		roleIds
			.map(id => permissions.roles.find(role => role.id_role === id))
			.filter(id => !!id)
	)

	const rolesAvailable = sortAssignableFirst(
		permissions.roles
			.filter(role => !roleIds.includes(role.id_role))
			.filter(id => !!id)
	)

	const privilegesUserHas = permissions.privileges
		.filter(privilege => {
			const rolesWithThisPrivilege = permissions.rolesHavePrivileges
				.filter(r => r.active && r.id_privilege === privilege.id_privilege)
			const rolesUserHas = rolesWithThisPrivilege
				.filter(r => roleIds.includes(r.id_role))
			return rolesUserHas.length > 0
		})

	async function ifChangingSelfThenReauthorize() {
		if (userId === administrativeModel.getState().access?.user?.userId)
			await administrativeModel.reauthorize()
	}

	async function clickToAssign({id_role}: RoleDisplay) {
		await administrativeModel.assignRoleToUser({
			userId,
			id_role,
			isPublic: true,
			timeframeEnd: undefined,
			timeframeStart: undefined,
		})
		updateLocalUserResultsCache.assignRole(userId, id_role)
		blur()
		await ifChangingSelfThenReauthorize()
		await search()
	}

	async function clickToRevoke({id_role}: RoleDisplay) {
		await administrativeModel.revokeRoleFromUser({
			userId,
			id_role,
		})
		updateLocalUserResultsCache.revokeRole(userId, id_role)
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
