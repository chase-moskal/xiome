
import {ApiError} from "renraku/x/api/api-error.js"
import {find} from "../../../../toolbox/dbby/dbby-mongo.js"
import {AccessPayload, AuthTables} from "../../../../types.js"

export async function requireUserIsAllowedToEditApp({appId, tables, access}: {
		appId: string
		tables: AuthTables
		access: AccessPayload
	}) {

	const {userId} = access.user
	const ownershipRow = await tables.appOwnership.one(find({userId, appId}))
	if (!ownershipRow) throw new ApiError(403, "user is not allowed")
}
