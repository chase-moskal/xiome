
import {AnyPermissions} from "../permissions-helpers.js"
import {appPermissions, platformPermissions} from "../standard-permissions.js"
import {RoleHasPrivilegeRow} from "../../../../features/auth/tables/types/rows/role-has-privilege-row.js"

export function permissionsMergingFacility({isPlatform}: {
		isPlatform: boolean
	}) {

	const hardPermissions: AnyPermissions = isPlatform
		? platformPermissions
		: appPermissions

	type HardPrivilegeDetail = {
		privilegeId: string
		roleId: string
		active: boolean
		immutable: boolean
	}

	function getHardPrivilegeDetails(...roleIds: string[]) {
		const results: HardPrivilegeDetail[] = []
		for (const roleId of roleIds) {
			const found = Object.entries(hardPermissions.roles)
				.find(([,role2]) => role2.roleId === roleId)
			if (found) {
				const [,role] = found
				for (const [label, has] of Object.entries(role.hasPrivileges)) {
					const privilegeId = hardPermissions.privileges[label]
					const already = results.find(
						detail =>
							detail.roleId === roleId &&
							detail.privilegeId === privilegeId
					)
					if (!already) {
						results.push({
							privilegeId,
							roleId,
							active: has.active,
							immutable: has.immutable,
						})
					}
				}
			}
		}
		return results
	}

	function mergeRoleHasPrivileges({hard, soft}: {
			hard: HardPrivilegeDetail[]
			soft: RoleHasPrivilegeRow[]
		}) {

		const results: RoleHasPrivilegeRow[] = []

		function rowMatch(hardy: HardPrivilegeDetail, softy: RoleHasPrivilegeRow) {
			return hardy.roleId === softy.roleId
				&& hardy.privilegeId === softy.privilegeId
		}

		function toSofty(hardy: HardPrivilegeDetail): RoleHasPrivilegeRow {
			return {
				roleId: hardy.roleId,
				privilegeId: hardy.privilegeId,
				active: hardy.active,
				immutable: hardy.immutable,
			}
		}

		for (const softy of soft) {
			const hardy = hard.find(h => rowMatch(h, softy))
			results.push(
				hardy && hardy.immutable
					? toSofty(hardy)
					: softy
			)
		}

		for (const hardy of hard) {
			const alreadyIncluded = !!results.find(softy => rowMatch(hardy, softy))
			if (!alreadyIncluded)
				results.push(toSofty(hardy))
		}

		return results
	}

	function getActivePrivilegeIds(roleHasPrivileges: RoleHasPrivilegeRow[]) {
		return roleHasPrivileges
			.filter(row => row.active)
			.map(row => row.privilegeId)
	}

	return {
		hardPermissions,
		mergeRoleHasPrivileges,
		getActivePrivilegeIds,
		getHardPrivilegeDetails,
	}
}
