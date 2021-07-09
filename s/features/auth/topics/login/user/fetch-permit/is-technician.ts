
import {find} from "../../../../../../toolbox/dbby/dbby-helpers.js"
import {UserTables} from "../../../../tables/types/table-groups/user-tables.js"
import {SecretConfig} from "../../../../../../assembly/backend/types/secret-config.js"

export async function isTechnician({id_user, tables, technician}: {
		id_user: string
		tables: UserTables
		technician: SecretConfig["platform"]["technician"]
	}) {

	if (!technician.email)
		throw new Error("technician email must be configured")

	const accountViaEmail = await tables.accountViaEmail.one(find({id_user}))

	return accountViaEmail?.email === technician.email
}
