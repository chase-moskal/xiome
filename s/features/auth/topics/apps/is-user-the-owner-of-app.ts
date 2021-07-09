
import {find} from "../../../../toolbox/dbby/dbby-mongo.js"
import {AuthTables} from "../../tables/types/auth-tables.js"
import {AccessPayload} from "../../types/tokens/access-payload.js"

export async function isUserOwnerOfApp({id_app, access, tables}: {
		id_app: string
		tables: AuthTables
		access: AccessPayload
	}) {

	const {id_user} = access.user
	const ownershipRow = await tables.app.appOwnership.one(find({id_user, id_app}))
	return !!ownershipRow
}
