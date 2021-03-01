
import {RoleRow} from "../../../../types/role-row"
import {HardPermissionsBlueprint} from "../../../../types/hard-permissions-blueprint"

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
