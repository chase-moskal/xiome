
import {AuthSchema} from "../../../../../types/auth-schema.js"
import {DamnId} from "../../../../../../../toolbox/damnedb/damn-id.js"
import {find} from "../../../../../../../toolbox/dbby/dbby-helpers.js"
import {SecretConfig} from "../../../../../../../assembly/backend/types/secret-config.js"

export async function isTechnician({userId, authTables, technician}: {
		userId: DamnId
		authTables: AuthSchema
		technician: SecretConfig["platform"]["technician"]
	}) {

	if (!technician.email)
		throw new Error("technician email must be configured")

	const accountViaEmail = await authTables.users.emails.one(find({userId}))

	return accountViaEmail?.email === technician.email
}
