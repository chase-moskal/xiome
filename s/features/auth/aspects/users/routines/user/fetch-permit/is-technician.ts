
import {Id, find} from "../../../../../../../toolbox/dbproxy/dbproxy.js"
import * as dbproxy from "../../../../../../../toolbox/dbproxy/dbproxy.js"

import {AuthSchema} from "../../../../../types/auth-schema.js"
import {SecretConfig} from "../../../../../../../assembly/backend/types/secret-config.js"

export async function isTechnician({userId, authTables, technician}: {
		userId: Id
		authTables: dbproxy.SchemaToTables<AuthSchema>
		technician: SecretConfig["platform"]["technician"]
	}) {

	if (!technician.email)
		throw new Error("technician email must be configured")

	const accountViaEmail = await authTables.users.emails.readOne(find({userId}))

	return accountViaEmail?.email === technician.email
}
