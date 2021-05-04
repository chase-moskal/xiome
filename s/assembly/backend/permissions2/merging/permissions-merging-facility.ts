
import {appPermissions, platformPermissions} from "../standard-permissions.js"
import {RoleHasPrivilegeRow} from "../../../../features/auth/tables/types/rows/role-has-privilege-row.js"

export function permissionsMergingFacility({isPlatform}: {
		isPlatform: boolean
	}) {
	
	const hardPermissions = isPlatform
		? platformPermissions
		: appPermissions

	type HardPrivilegeDetail = {
		privilegeId: string
		roleId: string
		active: boolean
		immutable: boolean
	}

	function getHardPrivilegeDetails(...roleIds: string[]) {
		const added: string[] = []
		const results: HardPrivilegeDetail[] = []
		for (const roleId of roleIds) {
			const [,role] = Object.entries(hardPermissions.roles)
				.find(([,role2]) => role2.roleId === roleId)
			for (const [label, has] of Object.entries(role.hasPrivileges)) {
				const privilegeId = hardPermissions.privileges[label]
				if (!added.includes(privilegeId)) {
					added.push(privilegeId)
					results.push({
						privilegeId,
						roleId,
						active: has.active,
						immutable: has.immutable,
					})
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

		// iterate over hard, merge in soft
		for (const {privilegeId, roleId, ...hardy} of hard) {
			const softy = soft.find(s => s.privilegeId)
			if (softy) {
				if (hardy.immutable) {
					results.push({
						privilegeId,
						roleId,
						active: hardy.active,
						customizable: !hardy.immutable,
					})
				}
				else {
					results.push(softy)
				}
			}
			else {
				results.push({
					privilegeId,
					roleId,
					active: hardy.active,
					customizable: !hardy.immutable,
				})
			}
		}

		// add remaining soft
		for (const softy of soft) {
			const exists = results.find(r => r.privilegeId === softy.privilegeId)
			if (!exists)
				results.push(softy)
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
