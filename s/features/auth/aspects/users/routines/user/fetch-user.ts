
import {Id} from "dbmage"
import * as dbmage from "dbmage"

import {fetchUsers} from "./fetch-users.js"
import {AuthSchema} from "../../../../types/auth-schema.js"
import {PermissionsEngine} from "../../../../../../assembly/backend/permissions/types/permissions-engine.js"

export async function fetchUser({userId, ...options}: {
		userId: Id
		permissionsEngine: PermissionsEngine
		authTables: dbmage.SchemaToTables<AuthSchema>
	}) {
	const results = await fetchUsers({...options, userIds: [userId]})
	return results.find(r => r.userId)
}
