
import {RoleRow} from "../tables/types/rows/role-row.js"
import {PrivilegeRow} from "../tables/types/rows/privilege-row.js"
import {UserHasRoleRow} from "../tables/types/rows/user-has-role-row.js"
import {DbbyTable} from "../../../toolbox/dbby/dbby-types.js"
import {RoleHasPrivilegeRow} from "../tables/types/rows/role-has-privilege-row.js"

export type PermissionsTables = {
	role: DbbyTable<RoleRow>
	privilege: DbbyTable<PrivilegeRow>
	userHasRole: DbbyTable<UserHasRoleRow>
	roleHasPrivilege: DbbyTable<RoleHasPrivilegeRow>
}
