
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
	const conditions = or(...userIds.map(userId => ({equal: {userId}})))

	const accounts = await authTables.user.account.read({conditions})
	const profiles = await authTables.user.profile.read({conditions})
	const publicRolesForUsers = await permissionsEngine.getPublicRolesForUsers(userIds)

	function assembleDetailsForEachUser(userId: string) {
		const account = accounts.find(a => a.userId === userId)
		const profile = profiles.find(p => p.userId === userId)

		if (!account)
			throw new ApiError(404, `account not found for user id ${userId}`)

		if (!profile)
			throw new ApiError(404, `profile not found for user id ${userId}`)

		const roles = publicRolesForUsers
			.find(r => r.userId === userId)
			.publicUserRoles

		const stats: UserStats = {
			joined: account.created,
		}

		return {
			userId,
			profile: profileFromRow(profile),
			roles,
			stats,
		}
	}

	return userIds.map(assembleDetailsForEachUser)
}
