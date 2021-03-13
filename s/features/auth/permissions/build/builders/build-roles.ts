
import {RolesBlueprint} from "../../types/roles-blueprint.js"
import {RoleRow} from "../../../tables/types/rows/role-row.js"

export function buildRoles(roles: RolesBlueprint): RoleRow[] {
	return Object.entries(roles)
		.map(([label, {roleId}]) => ({
			roleId,
			label,
			hard: true,
		}))
}
