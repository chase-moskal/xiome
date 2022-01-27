
import * as dbmage from "dbmage"

import {AppSchema} from "../types/app-tables.js"
import {AccessPayload} from "../../../types/auth-tokens.js"

export async function isUserOwnerOfApp({appId, access, appTables}: {
		appId: dbmage.Id
		appTables: dbmage.SchemaToTables<AppSchema>
		access: AccessPayload
	}) {

	const {userId: userIdString} = access.user
	const userId = dbmage.Id.fromString(userIdString)
	const ownershipRow = await appTables.owners.readOne(dbmage.find({userId, appId}))
	return !!ownershipRow
}
