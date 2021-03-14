
import {RolesBlueprint} from "../../types/roles-blueprint.js"
import {RoleHasPrivilegeRow} from "../../../../../features/auth/tables/types/rows/role-has-privilege-row.js"

export function buildRoleHasPrivileges(
			roles: RolesBlueprint
		): RoleHasPrivilegeRow[] {

	return Object.entries(roles)
		.map(([,roleData]) => Object.entries(roleData.privileges)
			.map(([,privilegeId]) => ({
				hard: true,
				privilegeId,
				roleId: roleData.roleId,
			})))
		.flat()
}
