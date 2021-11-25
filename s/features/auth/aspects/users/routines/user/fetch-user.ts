
import {AuthTables} from "../../../../types/auth-tables.js"
import {fetchPrivateUsers, fetchUsers} from "./fetch-users.js"
import {DamnId} from "../../../../../../toolbox/damnedb/damn-id.js"
import {PermissionsEngine} from "../../../../../../assembly/backend/permissions/types/permissions-engine.js"

export async function fetchUser({userId, ...options}: {
		userId: DamnId
		authTables: AuthTables
		permissionsEngine: PermissionsEngine
	}) {
	const results = await fetchUsers({...options, userIds: [userId]})
	return results.find(r => r.userId)
}

export async function fetchPrivateUser({userId, ...options}: {
		userId: DamnId
		authTables: AuthTables
		permissionsEngine: PermissionsEngine
	}) {
	const results = await fetchPrivateUsers({...options, userIds: [userId]})
	return results.find(r => r.userId)
}
