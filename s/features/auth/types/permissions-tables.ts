
import {RoleRow} from "./role-row.js"
import {PrivilegeRow} from "./privilege-row.js"
import {UserHasRoleRow} from "./user-has-role-row.js"
import {DbbyTable} from "../../../toolbox/dbby/dbby-types.js"
import {RoleHasPrivilegeRow} from "./role-has-privilege-row.js"

export type PermissionsTables = {
	role: DbbyTable<RoleRow>
	privilege: DbbyTable<PrivilegeRow>
	userHasRole: DbbyTable<UserHasRoleRow>
	roleHasPrivilege: DbbyTable<RoleHasPrivilegeRow>
}
