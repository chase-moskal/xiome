
import {HardPermissionsBlueprint, PrivilegeRow, RolePrivilegeRow} from "../../../../auth-types.js"

export function buildRolePrivileges(
			blueprint: HardPermissionsBlueprint,
			privileges: PrivilegeRow[],
		): RolePrivilegeRow[] {

	const inheritedRolePrivileges = blueprint.inherit?.rolePrivileges ?? []

	const newRolePrivileges = Object.entries(blueprint.roles)
		.map(([,{roleId, privileges: privilegeLabels}]) => privilegeLabels.map(label => {
			const privilege = privileges.find(row => row.label === label)
			if (!privilege) throw new Error(`hardcoded permission label not found "${label}"`)
			return {roleId, privilegeId: privilege.privilegeId}
		}))
		.flat()

	return [...inheritedRolePrivileges, ...newRolePrivileges]
}
