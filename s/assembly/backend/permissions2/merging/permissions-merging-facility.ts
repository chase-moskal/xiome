
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
		id_privilege: string
		id_role: string
		active: boolean
		immutable: boolean
	}

	function getHardPrivilegeDetails(...roleIds: string[]) {
		const results: HardPrivilegeDetail[] = []
		for (const id_role of roleIds) {
			const found = Object.entries(hardPermissions.roles)
				.find(([,role2]) => role2.id_role === id_role)
			if (found) {
				const [,role] = found
				for (const [label, has] of Object.entries(role.hasPrivileges)) {
					const id_privilege = hardPermissions.privileges[label]
					const already = results.find(
						detail =>
							detail.id_role === id_role &&
							detail.id_privilege === id_privilege
					)
					if (!already) {
						results.push({
							id_privilege,
							id_role,
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
			return hardy.id_role === softy.id_role
				&& hardy.id_privilege === softy.id_privilege
		}

		function toSofty(hardy: HardPrivilegeDetail): RoleHasPrivilegeRow {
			return {
				id_role: hardy.id_role,
				id_privilege: hardy.id_privilege,
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
			.map(row => row.id_privilege)
	}

	return {
		hardPermissions,
		mergeRoleHasPrivileges,
		getActivePrivilegeIds,
		getHardPrivilegeDetails,
	}
}
