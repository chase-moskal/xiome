
import {HardPermissionsBlueprint, PrivilegeRow, RoleHasPrivilegeRow} from "../../../../types/auth-types.js"

export function buildRoleHasPrivileges(
			blueprint: HardPermissionsBlueprint,
			privileges: PrivilegeRow[],
		): RoleHasPrivilegeRow[] {

	const inheritedRolePrivileges = blueprint.inherit?.roleHasPrivileges ?? []

	const newRolePrivileges = Object.entries(blueprint.roles)
		.map(([,{roleId, privileges: privilegeLabels}]) => privilegeLabels.map(label => {
			const privilege = privileges.find(row => row.label === label)
			if (!privilege) throw new Error(`hardcoded permission label not found "${label}"`)
			return {
				roleId,
				privilegeId: privilege.privilegeId,
				hard: true,
			}
		}))
		.flat()

	return [...inheritedRolePrivileges, ...newRolePrivileges]
}
