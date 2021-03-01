
import {RoleRow} from "../../../../tables/types/rows/role-row.js"
import {HardPermissionsBlueprint} from "../../../../types/hard-permissions-blueprint.js"

export function buildRoles(blueprint: HardPermissionsBlueprint): RoleRow[] {
	const inheritedRoles = blueprint.inherit?.roles ?? []
	const newRoles = Object.entries(blueprint.roles)
		.map(([label, {roleId}]) => ({
			roleId,
			label,
			hard: true,
		}))
	return [...inheritedRoles, ...newRoles]
}
