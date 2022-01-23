
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"

import {UserSchema} from "../aspects/users/types/user-tables.js"
import {PermissionsSchema} from "../aspects/permissions/types/permissions-tables.js"

export type AuthSchema = dbproxy.AsSchema<{
	users: UserSchema
	permissions: PermissionsSchema
}>
