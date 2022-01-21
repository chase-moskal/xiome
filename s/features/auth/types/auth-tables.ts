
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"

import {UserTables} from "../aspects/users/types/user-tables.js"
import {PermissionsTables} from "../aspects/permissions/types/permissions-tables.js"

export type AuthTables = dbproxy.AsSchema<{
	users: UserTables
	permissions: PermissionsTables
}>
