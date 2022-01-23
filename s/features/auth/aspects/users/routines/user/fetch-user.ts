
import {Id} from "../../../../../../toolbox/dbproxy/dbproxy.js"
import * as dbproxy from "../../../../../../toolbox/dbproxy/dbproxy.js"

import {fetchUsers} from "./fetch-users.js"
import {AuthSchema} from "../../../../types/auth-schema.js"
import {PermissionsEngine} from "../../../../../../assembly/backend/permissions/types/permissions-engine.js"

export async function fetchUser({userId, ...options}: {
		userId: Id
		permissionsEngine: PermissionsEngine
		authTables: dbproxy.SchemaToTables<AuthSchema>
	}) {
	const results = await fetchUsers({...options, userIds: [userId]})
	return results.find(r => r.userId)
}
