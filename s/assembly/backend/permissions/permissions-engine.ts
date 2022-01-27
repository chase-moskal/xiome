
import * as dbmage from "dbmage"
import {Id, find, findAll, or} from "dbmage"

import {merge} from "../../../toolbox/merge.js"
import {concurrent} from "../../../toolbox/concurrent.js"
import {permissionsMergingFacility} from "./merging/permissions-merging-facility.js"
import {PublicUserRole} from "../../../features/auth/aspects/users/types/public-user-role.js"
import {PermissionsSchema, PrivilegeRow, RoleRow} from "../../../features/auth/aspects/permissions/types/permissions-tables.js"
import {PermissionsDisplay} from "../../../features/auth/aspects/users/routines/permissions/types/permissions-display.js"
import {isCurrentlyWithinTimeframe} from "../../../features/auth/aspects/users/routines/user/utils/is-currently-within-timeframe.js"

export function makePermissionsEngine({isPlatform, permissionsTables}: {
		isPlatform: boolean
		permissionsTables: dbmage.SchemaToTables<PermissionsSchema>
	}) {

	const {
		hardPermissions,
		mergeRoleHasPrivileges,
		getActivePrivilegeIds,
		getHardPrivilegeDetails,
	} = permissionsMergingFacility({isPlatform})

	async function getAnonymousPrivileges() {
		const roleId = hardPermissions.roles.everybody.roleId
		const hard = getHardPrivilegeDetails(roleId)
		const soft = await permissionsTables.roleHasPrivilege
			.read(find({roleId: Id.fromString(roleId)}))
		return getActivePrivilegeIds(mergeRoleHasPrivileges({hard, soft}))
			.map(id => id.toString())
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
					equal: {userId: Id.fromString(userId)}
				}))),
			})
			const roleIds = usersHaveRolesRaw.map(u => u.roleId)
			const roles = roleIds.length
				? await permissionsTables.role.read({
					conditions: or(...roleIds.map(roleId => ({equal: {roleId}})))
				})
				: []
			const roleIdsThatActuallyExist = [
				...roles.map(r => r.roleId.toString()),
				...Object.entries(hardPermissions.roles)
					.map(([,role]) => role.roleId),
			]
			return usersHaveRolesRaw
				.filter(u => roleIdsThatActuallyExist.includes(u.roleId.toString()))
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
				.map(id => id.toString())
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
					roleId: Id.fromString(roleId),
					label,
					hard: true,
					public: role.public,
					assignable: role.assignable,
					time: 0,
				}
			}
			else {
				return undefined
			}
		}).filter(r => !!r)

		const allSoftRoles = allRoleIds.length
			? await permissionsTables.role.read({
				conditions: or(...allRoleIds.map(
					roleId => ({equal: {roleId: Id.fromString(roleId)}})
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
					const role = mergedRoles.find(
						r => r.roleId.toString() === userHasRole.roleId.toString()
					)
					if (!role)
						console.warn(`missing role "${userHasRole.roleId.toString()}"`)
					return role
						? {...userHasRole, ...role}
						: undefined
				})
				.filter(r => !!r)
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

	const {getPrivileges, getAllPrivileges} = (() => {
		function getAllHardPrivileges(): PrivilegeRow[] {
			return Object.entries(hardPermissions.privileges)
				.map(([label, privilegeId]) => ({
					privilegeId: Id.fromString(privilegeId),
					label,
					hard: true,
					time: 0,
				}))
		}
		function mergePrivileges(soft: PrivilegeRow[], hard: PrivilegeRow[]) {
			return merge(soft, hard, (a, b) => a.privilegeId === b.privilegeId)
				.map(({hard, label, time, privilegeId}) => ({
					hard,
					label,
					time: time ?? 0,
					privilegeId: privilegeId.toString(),
				}))
		}
		return {
			async getPrivileges(privilegeIds: string[]) {
				const soft = privilegeIds.length
					? await permissionsTables.privilege
						.read(findAll(privilegeIds, id => ({
							privilegeId: Id.fromString(id)
						})))
					: []
				const hard = getAllHardPrivileges()
					.filter(p => privilegeIds.includes(p.privilegeId.toString()))
				return mergePrivileges(soft, hard)
			},
			async getAllPrivileges() {
				const soft = await permissionsTables.privilege.read({conditions: false})
				const hard = getAllHardPrivileges()
				return mergePrivileges(soft, hard)
			},
		}
	})()

	async function getPermissionsDisplay(): Promise<PermissionsDisplay> {
		const all = {conditions: false} as const
		return concurrent({
			roles: (async() => {
				const soft = await permissionsTables.role.read(all)
				const hard: RoleRow[] = Object.entries(hardPermissions.roles)
					.map(([label, r]) => ({
						label,
						hard: true,
						roleId: Id.fromString(r.roleId),
						public: r.public,
						assignable: r.assignable,
						time: 0,
					}))
				return merge(soft, hard, (a, b) => a.roleId === b.roleId)
					.map(result => ({
						roleId: result.roleId.toString(),
						assignable: result.assignable,
						label: result.label,
						hard: result.hard,
						public: result.public,
						time: result.time ?? 0,
					}))
			})(),
			privileges: getAllPrivileges(),
			rolesHavePrivileges: (async() => {
				const roleIds = Object.values(hardPermissions.roles)
					.map(role => role.roleId)
				const hard = getHardPrivilegeDetails(...roleIds)
				const soft = await permissionsTables.roleHasPrivilege.read(all)
				return mergeRoleHasPrivileges({hard, soft})
					.map(({active, privilegeId, immutable, roleId, time}) => ({
						active,
						immutable,
						time: time ?? 0,
						roleId: roleId.toString(),
						privilegeId: privilegeId.toString(),
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
		getPrivileges,
		getAllPrivileges,
		getUserPrivileges,
	}
}
