
import {PrivilegeRow} from "../../../../types/PrivilegeRow"
import {HardPermissionsBlueprint} from "../../../../types/HardPermissionsBlueprint"

export function buildPrivileges(blueprint: HardPermissionsBlueprint): PrivilegeRow[] {
	const inheritedPrivileges = blueprint.inherit?.privileges ?? []
	const newPrivileges = Object.entries(blueprint.privileges)
		.map(([label, privilegeId]) => ({
			label,
			privilegeId,
			hard: true,
		}))
	return [...inheritedPrivileges, ...newPrivileges]
}
