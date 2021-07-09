
import {fetchUsers} from "./fetch-users.js"
import {AuthTables} from "../../../tables/types/auth-tables.js"
import {PermissionsEngine} from "../../../../../assembly/backend/permissions2/types/permissions-engine.js"

export async function fetchUser({id_user, ...options}: {
		id_user: string
		authTables: AuthTables
		permissionsEngine: PermissionsEngine
	}) {
	const results = await fetchUsers({...options, userIds: [id_user]})
	return results.find(r => r.id_user)
}
