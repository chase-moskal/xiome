
import {ApiError} from "renraku/x/api/api-error.js"
import {find} from "../../../../toolbox/dbby/dbby-mongo.js"
import {AccessPayload, AppTables} from "../../../../features/auth/auth-types.js"

export async function requireUserIsAllowedToEditApp({appId, access, appTables}: {
		appId: string
		access: AccessPayload
		appTables: AppTables
	}) {

	const {userId} = access.user
	const ownershipRow = await appTables.appOwnership.one(find({userId, appId}))
	if (!ownershipRow) throw new ApiError(403, "user is not allowed")
}
