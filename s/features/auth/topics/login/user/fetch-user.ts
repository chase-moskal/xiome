
import {fetchUsers} from "./fetch-users.js"
import {AuthTables} from "../../../tables/types/auth-tables.js"
import {PermissionsEngine} from "../../../../../assembly/backend/permissions2/types/permissions-engine.js"

export async function fetchUser({userId, ...options}: {
		userId: string
		authTables: AuthTables
		permissionsEngine: PermissionsEngine
	}) {
	const results = await fetchUsers({...options, userIds: [userId]})
	return results.find(r => r.userId)
}
