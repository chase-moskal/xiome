
import {Id} from "dbmage"

import {PermissionsInteractions} from "./interactions.js"
import {UserHasRoleRow} from "../../auth/aspects/permissions/types/permissions-tables.js"

export function mockPermissionsInteractions(): {
		permissionsInteractions: PermissionsInteractions
		getUserPermissions(userId: Id): {
			userHasRoles: UserHasRoleRow[]
		}
	} {

	const map = new Map<string, UserHasRoleRow[]>()

	function getUserPermissions(userId: Id) {
		const id = userId.string
		if (!map.has(id))
			map.set(id, [])
		return {
			get userHasRoles() {
				return map.get(id)
			},
			set userHasRoles(rows: UserHasRoleRow[]) {
				map.set(id, rows)
			},
		}
	}

	return {
		getUserPermissions,
		permissionsInteractions: {
			async grantUserRoles({userId, timeframeStart, timeframeEnd, roleIds}) {
				const record = getUserPermissions(userId)
				const rows = record.userHasRoles
				const time = Date.now()
				for (const roleId of roleIds)
					rows.push({
						userId,
						roleId,
						hard: true,
						public: true,
						time,
						timeframeEnd,
						timeframeStart,
					})
			},
			async revokeUserRoles({userId, roleIds}) {
				const record = getUserPermissions(userId)
				const stringRoleIdsToRemove = roleIds.map(roleId => roleId.string)
				record.userHasRoles = record.userHasRoles
					.filter(row => stringRoleIdsToRemove.includes(row.roleId.string))
			},
		}
	}
}
