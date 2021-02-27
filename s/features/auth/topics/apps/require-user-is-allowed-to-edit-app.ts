
import {ApiError} from "renraku/x/api/api-error.js"
import {find} from "../../../../toolbox/dbby/dbby-mongo.js"
import {AuthTables} from "../../tables/types/auth-tables.js"
import {AccessPayload} from "../../../../features/auth/auth-types.js"

export async function requireUserIsAllowedToEditApp({appId, access, tables}: {
		appId: string
		tables: AuthTables
		access: AccessPayload
	}) {

	const {userId} = access.user
	const ownershipRow = await tables.app.appOwnership.one(find({userId, appId}))
	if (!ownershipRow) throw new ApiError(403, "user is not allowed")
}
