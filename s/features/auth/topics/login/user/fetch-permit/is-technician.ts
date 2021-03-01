
import {find} from "../../../../../../toolbox/dbby/dbby-helpers.js"
import {UserTables} from "../../../../types/user-tables"
import {PlatformConfig} from "../../../../types/platform-config.js"

export async function isTechnician({userId, tables, technician}: {
			userId: string
			tables: UserTables
			technician: PlatformConfig["platform"]["technician"]
		}) {
	if (!technician.email) throw new Error("technician email must be configured")
	const accountViaEmail = await tables.accountViaEmail.one(find({userId}))
	return accountViaEmail?.email === technician.email
}
