
import {fetchUsers} from "./fetch-users.js"
import {AuthTables} from "../../../../types/auth-tables.js"
import {DamnId} from "../../../../../../toolbox/damnedb/damn-id.js"
import {PermissionsEngine} from "../../../../../../assembly/backend/permissions2/types/permissions-engine.js"

export async function fetchUser({userId, ...options}: {
		userId: DamnId
		authTables: AuthTables
		permissionsEngine: PermissionsEngine
	}) {
	const results = await fetchUsers({...options, userIds: [userId]})
	return results.find(r => r.userId)
}
