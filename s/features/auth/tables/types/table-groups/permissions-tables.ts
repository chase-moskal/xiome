
import {RoleRow} from "../rows/role-row.js"
import {PrivilegeRow} from "../rows/privilege-row.js"
import {UserHasRoleRow} from "../rows/user-has-role-row.js"
import {DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"
import {RoleHasPrivilegeRow} from "../rows/role-has-privilege-row.js"

export type PermissionsTables = {
	role: DbbyTable<RoleRow>
	privilege: DbbyTable<PrivilegeRow>
	userHasRole: DbbyTable<UserHasRoleRow>
	roleHasPrivilege: DbbyTable<RoleHasPrivilegeRow>
}
