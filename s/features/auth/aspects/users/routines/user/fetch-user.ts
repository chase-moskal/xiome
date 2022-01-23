
import {fetchUsers} from "./fetch-users.js"
import {AuthSchema} from "../../../../types/auth-schema.js"
import {DamnId} from "../../../../../../toolbox/damnedb/damn-id.js"
import {PermissionsEngine} from "../../../../../../assembly/backend/permissions/types/permissions-engine.js"

export async function fetchUser({userId, ...options}: {
		userId: DamnId
		authTables: AuthSchema
		permissionsEngine: PermissionsEngine
	}) {
	const results = await fetchUsers({...options, userIds: [userId]})
	return results.find(r => r.userId)
}
