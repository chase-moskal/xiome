
import {RoleRow} from "../tables/types/rows/role-row.js"
import {PrivilegeRow} from "../tables/types/rows/privilege-row.js"
import {UserHasRoleRow} from "../tables/types/rows/user-has-role-row.js"
import {RoleHasPrivilegeRow} from "../tables/types/rows/role-has-privilege-row.js"

export type HardPermissions = {
	roles: RoleRow[]
	privileges: PrivilegeRow[]
	userHasRoles: UserHasRoleRow[]
	roleHasPrivileges: RoleHasPrivilegeRow[]
}
