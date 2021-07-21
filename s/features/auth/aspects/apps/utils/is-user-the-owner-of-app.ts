
import {AppTables} from "../types/app-tables.js"
import {AccessPayload} from "../../../types/auth-tokens.js"
import {find} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"

export async function isUserOwnerOfApp({appId, access, appTables}: {
		appId: DamnId
		appTables: AppTables
		access: AccessPayload
	}) {

	const {userId: userIdString} = access.user
	const userId = DamnId.fromString(userIdString)
	const ownershipRow = await appTables.owners.one(find({userId, appId}))
	return !!ownershipRow
}
