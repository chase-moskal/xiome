
import {HardPermissionsBlueprint, PrivilegeRow} from "../../../../auth-types.js"

export function buildPrivileges(blueprint: HardPermissionsBlueprint): PrivilegeRow[] {
	const inheritedPrivileges = blueprint.inherit?.privileges ?? []
	const newPrivileges = Object.entries(blueprint.privileges).map(([label, privilegeId]) => ({label, privilegeId}))
	return [...inheritedPrivileges, ...newPrivileges]
}
