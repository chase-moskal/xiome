
import * as dbmage from "dbmage"

import {UserSchema} from "../aspects/users/types/user-tables.js"
import {PermissionsSchema} from "../aspects/permissions/types/permissions-tables.js"

export type AuthSchema = dbmage.AsSchema<{
	users: UserSchema
	permissions: PermissionsSchema
}>

export const authShape: dbmage.SchemaToShape<AuthSchema> = {
	users: {
		accounts: true,
		emails: true,
		latestLogins: true,
		profiles: true,
	},
	permissions: {
		privilege: true,
		role: true,
		roleHasPrivilege: true,
		userHasRole: true,
	},
}
