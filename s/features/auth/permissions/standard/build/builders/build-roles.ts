
import {HardPermissionsBlueprint, RoleRow} from "../../../../auth-types.js"

export function buildRoles(blueprint: HardPermissionsBlueprint): RoleRow[] {
	const inheritedRoles = blueprint.inherit?.roles ?? []
	const newRoles = Object.entries(blueprint.roles)
		.map(([label, {roleId}]) => ({roleId, label, hard: true}))
	return [...inheritedRoles, ...newRoles]
}
