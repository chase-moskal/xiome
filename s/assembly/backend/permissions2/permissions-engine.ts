
import {find, or} from "../../../toolbox/dbby/dbby-helpers.js"
import {RoleRow} from "../../../features/auth/tables/types/rows/role-row.js"
import {PublicUserRole} from "../../../features/auth/types/public-user-role.js"
import {permissionsMergingFacility} from "./merging/permissions-merging-facility.js"
import {PermissionsTables} from "../../../features/auth/tables/types/table-groups/permissions-tables.js"
import {isCurrentlyWithinTimeframe} from "../../../features/auth/topics/login/user/utils/is-currently-within-timeframe.js"

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

	async function getUserRoleIds({userId, onlyPublic}: {
			userId: string
			onlyPublic: boolean
		}) {
		const isPublic = (row: {public: boolean}) => row.public
		const all = <X>(x: X) => x
		return (await permissionsTables.userHasRole
			.read(find({userId})))
			.filter(isCurrentlyWithinTimeframe)
			.filter(isPublic)
			.filter(onlyPublic ? isPublic : all)
	}

	async function getUserPrivileges(userId: string) {
		const roleIds = (await getUserRoleIds({userId, onlyPublic: false}))
			.map(x => x.roleId)
		const hard = getHardPrivilegeDetails(...roleIds)
		const soft = await permissionsTables.roleHasPrivilege.read({
			conditions: or(...roleIds.map(roleId => ({equal: {roleId}})))
		})
		return getActivePrivilegeIds(merge({hard, soft}))
	}

	async function getUserPublicRoles(userId: string) {
		const userHasRoles = await getUserRoleIds({userId, onlyPublic: true})
		const roleIds = userHasRoles.map(x => x.roleId)
		const hardRoles: RoleRow[] = roleIds.map(roleId => {
			const [label] = Object.entries(hardPermissions.roles)
				.find(([,role]) => role.roleId === roleId)
			return {roleId, label, hard: true}
		})
		const softRoles = await permissionsTables.role.read({
			conditions: or(...roleIds.map(roleId => ({equal: {roleId}})))
		})

		const mergedRoles = [...hardRoles]
		for (const role of softRoles) {
			const found = mergedRoles.find(r => r.roleId === role.roleId)
			if (!found)
				mergedRoles.push(role)
		}

		const combinedData = userHasRoles.map(userHasRole => {
			const roleRow = mergedRoles.find(row => row.roleId === userHasRole.roleId)
			return {...userHasRole, ...roleRow}
		})

		return combinedData.map(x => (<PublicUserRole>{
			roleId: x.roleId,
			label: x.label,
			timeframeEnd: x.timeframeEnd,
			timeframeStart: x.timeframeStart,
		}))
	}

	return {
		getUserPrivileges,
		getUserPublicRoles,
		getAnonymousPrivileges,
	}
}
