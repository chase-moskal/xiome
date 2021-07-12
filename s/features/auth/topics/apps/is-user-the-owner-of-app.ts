
import {AuthTables} from "../../tables/types/auth-tables.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {AccessPayload} from "../../types/tokens/access-payload.js"

export async function isUserOwnerOfApp({id_app, access, tables}: {
		id_app: string
		tables: AuthTables
		access: AccessPayload
	}) {

	const {userId: userIdString} = access.user
	const userId = DamnId.fromString(userIdString)
	const ownershipRow = await tables.app.appOwnership.one(find({userId, id_app}))
	return !!ownershipRow
}
