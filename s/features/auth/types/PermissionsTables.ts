import {DbbyTable} from "../../../toolbox/dbby/dbby-types.js"
import {RoleHasPrivilegeRow} from "./RoleHasPrivilegeRow.js"
import {UserHasRoleRow} from "./UserHasRoleRow.js"
import {PrivilegeRow} from "./PrivilegeRow.js"
import {RoleRow} from "./RoleRow.js"

// database rows
//

export type PermissionsTables = {
	role: DbbyTable<RoleRow>
	privilege: DbbyTable<PrivilegeRow>
	userHasRole: DbbyTable<UserHasRoleRow>
	roleHasPrivilege: DbbyTable<RoleHasPrivilegeRow>
}
