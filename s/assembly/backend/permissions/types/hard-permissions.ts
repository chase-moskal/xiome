
import {RoleRow} from "../../../../features/auth/tables/types/rows/role-row.js"
import {PrivilegeRow} from "../../../../features/auth/tables/types/rows/privilege-row.js"
import {UserHasRoleRow} from "../../../../features/auth/tables/types/rows/user-has-role-row.js"
import {RoleHasPrivilegeRow} from "../../../../features/auth/tables/types/rows/role-has-privilege-row.js"

export type HardPermissions = {
	roles: RoleRow[]
	privileges: PrivilegeRow[]
	userHasRoles: UserHasRoleRow[]
	roleHasPrivileges: RoleHasPrivilegeRow[]
}
