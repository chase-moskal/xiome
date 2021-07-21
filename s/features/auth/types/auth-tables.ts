
import {UserTables} from "../aspects/users/types/user-tables.js"
import {PermissionsTables} from "../aspects/permissions/types/permissions-tables.js"

export type AuthTables = {
	users: UserTables
	permissions: PermissionsTables
}
