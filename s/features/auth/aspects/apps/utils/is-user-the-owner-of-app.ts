
import * as dbproxy from "../../../../../toolbox/dbproxy/dbproxy.js"

import {AppSchema} from "../types/app-tables.js"
import {AccessPayload} from "../../../types/auth-tokens.js"

export async function isUserOwnerOfApp({appId, access, appTables}: {
		appId: dbproxy.Id
		appTables: dbproxy.SchemaToTables<AppSchema>
		access: AccessPayload
	}) {

	const {userId: userIdString} = access.user
	const userId = dbproxy.Id.fromString(userIdString)
	const ownershipRow = await appTables.owners.readOne(dbproxy.find({userId, appId}))
	return !!ownershipRow
}
