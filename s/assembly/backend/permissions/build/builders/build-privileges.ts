
import {PrivilegesBlueprint} from "../../types/privilege-blueprint.js"
import {PrivilegeRow} from "../../../../../features/auth/tables/types/rows/privilege-row.js"

export function buildPrivileges(
			privileges: PrivilegesBlueprint
		): PrivilegeRow[] {

	return Object.entries(privileges)
		.map(([label, privilegeId]) => ({
			label,
			privilegeId,
			hard: true,
		}))
}
