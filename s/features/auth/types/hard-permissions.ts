
import {RoleRow} from "./role-row.js"
import {PrivilegeRow} from "./privilege-row.js"
import {UserHasRoleRow} from "./user-has-role-row.js"
import {RoleHasPrivilegeRow} from "./role-has-privilege-row.js"

export type HardPermissions = {
	roles: RoleRow[]
	privileges: PrivilegeRow[]
	userHasRoles: UserHasRoleRow[]
	roleHasPrivileges: RoleHasPrivilegeRow[]
}
