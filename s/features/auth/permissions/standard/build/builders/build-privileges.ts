
import {PrivilegeRow} from "../../../../tables/types/rows/privilege-row.js"
import {HardPermissionsBlueprint} from "../../../types/hard-permissions-blueprint.js"

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
