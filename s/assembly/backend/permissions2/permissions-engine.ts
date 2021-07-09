
import {merge} from "../../../toolbox/merge.js"
import {concurrent} from "../../../toolbox/concurrent.js"
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
		const id_role = hardPermissions.roles.anonymous.id_role
		const hard = getHardPrivilegeDetails(id_role)
		const soft = await permissionsTables.roleHasPrivilege
			.read(find({id_role}))
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
				conditions: or(...userIds.map(id_user => ({equal: {id_user}})))
			})
			const roleIds = usersHaveRolesRaw.map(u => u.id_role)
			if (userIds.length === 0)
				throw new Error("invalid: role ids cannot be empty")
			const roles = await permissionsTables.role.read({
				conditions: or(...roleIds.map(id_role => ({equal: {id_role}})))
			})
			const roleIdsThatActuallyExist = [
				...roles.map(r => r.id_role),
				...Object.entries(hardPermissions.roles)
					.map(([,role]) => role.id_role),
			]
			return usersHaveRolesRaw
				.filter(u => roleIdsThatActuallyExist.includes(u.id_role))
		})()

		return userIds.map(id_user => {
			const raw = usersHaveRoles.filter(r => r.id_user === id_user)
			const userHasRoles = raw
				.filter(isCurrentlyWithinTimeframe)
				.filter(onlyGetPublicRoles ? isPublic : all)
			return {id_user, userHasRoles}
		})
	}

	async function getPrivilegesForUsers(userIds: string[]) {
		const rolesForUsers = await getUsersHaveRoles({
			userIds,
			onlyGetPublicRoles: false,
		})

		const allRoleIds = rolesForUsers
			.flatMap(r => r.userHasRoles.map(r2 => r2.id_role))

		const allRolesHavePrivileges = allRoleIds.length
			? await permissionsTables.roleHasPrivilege.read({
				conditions: or(...allRoleIds.map(id_role => ({equal: ({id_role})})))
			})
			: []

		function resolvePrivilegesForEachUser(id_user: string) {
			const roleIds = rolesForUsers
				.find(r => r.id_user === id_user)
				.userHasRoles
				.map(r => r.id_role)
			// roleIds.push(universalPermissions.roles.authenticated.id_role)
			const hard = getHardPrivilegeDetails(...roleIds)
			const soft = roleIds
				.flatMap(id_role => allRolesHavePrivileges.filter(p => p.id_role === id_role))
			const privileges = getActivePrivilegeIds(mergeRoleHasPrivileges({hard, soft}))
			return {id_user, privileges}
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
				.map(r2 => r2.id_role))

		const allHardRoles: RoleRow[] = allRoleIds.map(id_role => {
			const found = Object.entries(hardPermissions.roles)
				.find(([,role]) => role.id_role === id_role)
			if (found) {
				const [label, role] = found
				return {
					id_role,
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
				conditions: or(...allRoleIds.map(id_role => ({equal: {id_role}})))
			})
			: []

		const mergedRoles = [...allHardRoles]
		for (const role of allSoftRoles) {
			const found = mergedRoles.find(r => r.id_role === role.id_role)
			if (!found)
				mergedRoles.push(role)
		}

		function assemblePublicRolesForEachUser(id_user: string) {
			const userHasRoles = rolesForUsers
				.find(r => r.id_user === id_user)
				.userHasRoles
			const publicUserRoles = userHasRoles
				.map(userHasRole => {
					const roleRow = mergedRoles.find(row => row.id_role === userHasRole.id_role)
					return {...userHasRole, ...roleRow}
				})
				.filter(isCurrentlyWithinTimeframe)
				.map(r => (<PublicUserRole>{
					label: r.label,
					id_role: r.id_role,
					timeframeEnd: r.timeframeEnd,
					timeframeStart: r.timeframeStart,
				}))
			return {id_user, publicUserRoles}
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
						id_role: r.id_role,
						public: r.public,
						assignable: r.assignable,
					}))
				return merge(soft, hard, (a, b) => a.id_role === b.id_role)
			})(),
			privileges: (async() => {
				const soft = await permissionsTables.privilege.read(all)
				const hard: PrivilegeRow[] = Object.entries(hardPermissions.privileges)
					.map(([label, id_privilege]) => ({id_privilege, label, hard: true}))
				return merge(soft, hard, (a, b) => a.id_privilege === b.id_privilege)
			})(),
			rolesHavePrivileges: (async() => {
				const roleIds = Object.values(hardPermissions.roles)
					.map(role => role.id_role)
				const hard = getHardPrivilegeDetails(...roleIds)
				const soft = await permissionsTables.roleHasPrivilege.read(all)
				return mergeRoleHasPrivileges({hard, soft})
			})(),
		})
	}

	async function getUserPrivileges(id_user: string) {
		const result = await getPrivilegesForUsers([id_user])
		return result
			.find(r => r.id_user === id_user)
			.privileges
	}

	// async function getUserPublicRoles(id_user: string) {
	// 	const result = await getPublicRolesForUsers([id_user])
	// 	return result
	// 		.find(r => r.id_user === id_user)
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
