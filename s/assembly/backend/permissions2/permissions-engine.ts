
import {merge} from "../../../toolbox/merge.js"
import {concurrent} from "../../../toolbox/concurrent.js"
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {find, or} from "../../../toolbox/dbby/dbby-helpers.js"
import {RoleRow} from "../../../features/auth/tables/types/rows/role-row.js"
import {PublicUserRole} from "../../../features/auth/types/public-user-role.js"
import {permissionsMergingFacility} from "./merging/permissions-merging-facility.js"
import {PrivilegeRow} from "../../../features/auth/tables/types/rows/privilege-row.js"
import {PermissionsTables} from "../../../features/auth/tables/types/table-groups/permissions-tables.js"
import {isCurrentlyWithinTimeframe} from "../../../features/auth/topics/login/user/utils/is-currently-within-timeframe.js"

export function makePermissionsEngine({isPlatform, permissionsTables}: {
		isPlatform: boolean
		permissionsTables: PermissionsTables
	}) {

	const {
		hardPermissions,
		mergeRoleHasPrivileges,
		getActivePrivilegeIds,
		getHardPrivilegeDetails,
	} = permissionsMergingFacility({isPlatform})

	async function getAnonymousPrivileges() {
		const roleId = hardPermissions.roles.anonymous.roleId
		const hard = getHardPrivilegeDetails(roleId)
		const soft = await permissionsTables.roleHasPrivilege
			.read(find({roleId: DamnId.fromString(roleId)}))
		return getActivePrivilegeIds(mergeRoleHasPrivileges({hard, soft}))
	}

	async function getUsersHaveRoles({userIds, onlyGetPublicRoles}: {
			userIds: string[]
			onlyGetPublicRoles: boolean
		}) {

		const isPublic = (row: {public: boolean}) => row.public
		const all = <X>(x: X) => x

		const usersHaveRoles = await (async() => {
			if (userIds.length === 0)
				throw new Error("invalid: user ids cannot be empty")
			const usersHaveRolesRaw = await permissionsTables.userHasRole.read({
				conditions: or(...userIds.map(userId => ({
					equal: {userId: DamnId.fromString(userId)}
				}))),
			})
			const roleIds = usersHaveRolesRaw.map(u => u.roleId)
			const roles = roleIds.length
				? await permissionsTables.role.read({
					conditions: or(...roleIds.map(roleId => ({equal: {roleId}})))
				})
				: []
			const roleIdsThatActuallyExist = [
				...roles.map(r => r.roleId),
				...Object.entries(hardPermissions.roles)
					.map(([,role]) => role.roleId),
			]
			return usersHaveRolesRaw
				.filter(u => roleIdsThatActuallyExist.includes(u.roleId))
		})()

		return userIds.map(userId => {
			const raw = usersHaveRoles.filter(r => r.userId.toString() === userId)
			const userHasRoles = raw
				.filter(isCurrentlyWithinTimeframe)
				.filter(onlyGetPublicRoles ? isPublic : all)
			return {userId, userHasRoles}
		})
	}

	async function getPrivilegesForUsers(userIds: string[]) {
		const rolesForUsers = await getUsersHaveRoles({
			userIds,
			onlyGetPublicRoles: false,
		})

		const allRoleIds = rolesForUsers
			.flatMap(r => r.userHasRoles.map(r2 => r2.roleId))

		const allRolesHavePrivileges = allRoleIds.length
			? await permissionsTables.roleHasPrivilege.read({
				conditions: or(...allRoleIds.map(roleId => ({equal: ({roleId})})))
			})
			: []

		function resolvePrivilegesForEachUser(userId: string) {
			const roleIds = rolesForUsers
				.find(r => r.userId === userId)
				.userHasRoles
				.map(r => r.roleId.toString())
			// roleIds.push(universalPermissions.roles.authenticated.roleId)
			const hard = getHardPrivilegeDetails(...roleIds)
			const soft = roleIds
				.flatMap(roleId => allRolesHavePrivileges.filter(p => p.roleId.toString() === roleId))
			const privileges = getActivePrivilegeIds(mergeRoleHasPrivileges({hard, soft}))
			return {userId, privileges}
		}

		return userIds.map(resolvePrivilegesForEachUser)
	}

	async function getPublicRolesForUsers(userIds: string[]) {
		const rolesForUsers = await getUsersHaveRoles({
			userIds,
			onlyGetPublicRoles: true,
		})

		const allRoleIds = rolesForUsers
			.flatMap(r => r.userHasRoles
				.filter(r2 => r2.public)
				.map(r2 => r2.roleId.toString()))

		const allHardRoles: RoleRow[] = allRoleIds.map(roleId => {
			const found = Object.entries(hardPermissions.roles)
				.find(([,role]) => role.roleId === roleId)
			if (found) {
				const [label, role] = found
				return {
					roleId: DamnId.fromString(roleId),
					label,
					hard: true,
					public: role.public,
					assignable: role.assignable,
				}
			}
			else {
				return undefined
			}
		}).filter(r => !!r)

		const allSoftRoles = allRoleIds.length
			? await permissionsTables.role.read({
				conditions: or(...allRoleIds.map(
					roleId => ({equal: {roleId: DamnId.fromString(roleId)}})
				))
			})
			: []

		const mergedRoles = [...allHardRoles]
		for (const role of allSoftRoles) {
			const found = mergedRoles.find(r => r.roleId === role.roleId)
			if (!found)
				mergedRoles.push(role)
		}

		function assemblePublicRolesForEachUser(userId: string) {
			const userHasRoles = rolesForUsers
				.find(r => r.userId === userId)
				.userHasRoles
			const publicUserRoles = userHasRoles
				.map(userHasRole => {
					const roleRow = mergedRoles.find(row => row.roleId === userHasRole.roleId)
					return {...userHasRole, ...roleRow}
				})
				.filter(isCurrentlyWithinTimeframe)
				.map(r => (<PublicUserRole>{
					label: r.label,
					roleId: r.roleId.toString(),
					timeframeEnd: r.timeframeEnd,
					timeframeStart: r.timeframeStart,
				}))
			return {userId, publicUserRoles}
		}

		return userIds.map(assemblePublicRolesForEachUser)
	}

	async function getPermissionsDisplay() {
		const all = {conditions: false} as const
		return concurrent({
			roles: (async() => {
				const soft = await permissionsTables.role.read(all)
				const hard: RoleRow[] = Object.entries(hardPermissions.roles)
					.map(([label, r]) => ({
						label,
						hard: true,
						roleId: DamnId.fromString(r.roleId),
						public: r.public,
						assignable: r.assignable,
					}))
				return merge(soft, hard, (a, b) => a.roleId === b.roleId)
					.map(result => ({
						roleId: result.roleId.toString(),
						assignable: result.assignable,
						label: result.label,
						hard: result.hard,
						public: result.public,
					}))
			})(),
			privileges: (async() => {
				const soft = await permissionsTables.privilege.read(all)
				const hard: PrivilegeRow[] = Object.entries(hardPermissions.privileges)
					.map(([label, id_privilege]) => ({id_privilege, label, hard: true}))
				return merge(soft, hard, (a, b) => a.id_privilege === b.id_privilege)
					.map(({hard, label, id_privilege}) => ({
						hard,
						label,
						id_privilege,
					}))
			})(),
			rolesHavePrivileges: (async() => {
				const roleIds = Object.values(hardPermissions.roles)
					.map(role => role.roleId)
				const hard = getHardPrivilegeDetails(...roleIds)
				const soft = await permissionsTables.roleHasPrivilege.read(all)
				return mergeRoleHasPrivileges({hard, soft})
					.map(({active, id_privilege, immutable, roleId}) => ({
						active,
						id_privilege,
						immutable,
						roleId: roleId.toString(),
					}))
			})(),
		})
	}

	async function getUserPrivileges(userId: string) {
		const result = await getPrivilegesForUsers([userId])
		return result
			.find(r => r.userId === userId)
			.privileges
	}

	// async function getUserPublicRoles(userId: string) {
	// 	const result = await getPublicRolesForUsers([userId])
	// 	return result
	// 		.find(r => r.userId === userId)
	// 		.publicUserRoles
	// }

	return {
		getUsersHaveRoles,
		getAnonymousPrivileges,
		getPrivilegesForUsers,
		getPublicRolesForUsers,
		getPermissionsDisplay,
		getUserPrivileges,
	}
}
