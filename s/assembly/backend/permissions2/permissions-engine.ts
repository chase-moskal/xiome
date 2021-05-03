
import {find, or} from "../../../toolbox/dbby/dbby-helpers.js"
import {permissionsMergingFacility} from "./merging/permissions-merging-facility.js"
import {PermissionsTables} from "../../../features/auth/tables/types/table-groups/permissions-tables.js"

export function makePermissionsEngine({isPlatform, permissionsTables}: {
		isPlatform: boolean
		permissionsTables: PermissionsTables
	}) {

	const {
		hardPermissions,
		merge,
		getActivePrivilegeIds,
		getHardPrivilegeDetails,
	} = permissionsMergingFacility({isPlatform})

	async function getAnonymousPrivileges() {
		const roleId = hardPermissions.roles.anonymous.roleId
		const hard = getHardPrivilegeDetails(roleId)
		const soft = await permissionsTables.roleHasPrivilege
			.read(find({roleId}))
		return getActivePrivilegeIds(merge({hard, soft}))
	}

	async function getUserPrivileges(userId: string) {
		const userHasRoles = await permissionsTables.userHasRole.read(find({userId}))
		const roleIds = userHasRoles.map(({roleId}) => roleId)
		const hard = getHardPrivilegeDetails(...roleIds)
		const soft = await permissionsTables.roleHasPrivilege.read({
			conditions: or(...roleIds.map(roleId => ({equal: {roleId}})))
		})
		return getActivePrivilegeIds(merge({hard, soft}))
	}

	return {
		getUserPrivileges,
		getAnonymousPrivileges,
	}
}
