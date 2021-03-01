
import {PrivilegeRow} from "../../../../types/privilege-row"
import {HardPermissionsBlueprint} from "../../../../types/hard-permissions-blueprint"

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
