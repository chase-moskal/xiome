import {RoleHasPrivilegeRow} from "./RoleHasPrivilegeRow.js"
import {UserHasRoleRow} from "./UserHasRoleRow.js"
import {PrivilegeRow} from "./PrivilegeRow.js"
import {RoleRow} from "./RoleRow.js"


export type HardPermissions = {
	roles: RoleRow[]
	privileges: PrivilegeRow[]
	userHasRoles: UserHasRoleRow[]
	roleHasPrivileges: RoleHasPrivilegeRow[]
}
