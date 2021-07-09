
import {ApiError} from "renraku/x/api/api-error.js"
import {UserStats} from "../../../types/user-stats.js"
import {profileFromRow} from "./profile/profile-from-row.js"
import {or} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {AuthTables} from "../../../tables/types/auth-tables.js"
import {PermissionsEngine} from "../../../../../assembly/backend/permissions2/types/permissions-engine.js"

export async function fetchUsers({userIds, authTables, permissionsEngine}: {
		userIds: string[]
		authTables: AuthTables
		permissionsEngine: PermissionsEngine
	}) {

	if (!userIds.length)
		throw new Error("invalid: userIds cannot be empty")

	const conditions = or(...userIds.map(id_user => ({equal: {id_user}})))

	const accounts = await authTables.user.account.read({conditions})
	const profiles = await authTables.user.profile.read({conditions})
	const publicRolesForUsers = await permissionsEngine.getPublicRolesForUsers(userIds)

	function assembleDetailsForEachUser(id_user: string) {
		const account = accounts.find(a => a.id_user === id_user)
		const profile = profiles.find(p => p.id_user === id_user)

		if (!account)
			throw new ApiError(404, `account not found for user id ${id_user}`)

		if (!profile)
			throw new ApiError(404, `profile not found for user id ${id_user}`)

		const roles = publicRolesForUsers
			.find(r => r.id_user === id_user)
			.publicUserRoles

		const stats: UserStats = {
			joined: account.created,
		}

		return {
			id_user,
			profile: profileFromRow(profile),
			roles,
			stats,
		}
	}

	return userIds.map(assembleDetailsForEachUser)
}
