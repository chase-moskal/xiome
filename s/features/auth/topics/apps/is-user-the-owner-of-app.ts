
import {find} from "../../../../toolbox/dbby/dbby-mongo.js"
import {AuthTables} from "../../tables/types/auth-tables.js"
import {AccessPayload} from "../../types/tokens/access-payload.js"

export async function isUserOwnerOfApp({appId, access, tables}: {
		appId: string
		tables: AuthTables
		access: AccessPayload
	}) {

	const {userId} = access.user
	const ownershipRow = await tables.app.appOwnership.one(find({userId, appId}))
	return !!ownershipRow
}
