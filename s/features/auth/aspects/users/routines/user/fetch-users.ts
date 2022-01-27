
import * as renraku from "renraku"
import {Id, or} from "dbmage"
import * as dbmage from "dbmage"

import {UserStats} from "../../types/user-stats.js"
import {AuthSchema} from "../../../../types/auth-schema.js"
import {profileFromRow} from "../profile/profile-from-row.js"
import {PermissionsEngine} from "../../../../../../assembly/backend/permissions/types/permissions-engine.js"

export async function fetchUsers({userIds, authTables, permissionsEngine}: {
		userIds: Id[]
		authTables: dbmage.SchemaToTables<AuthSchema>
		permissionsEngine: PermissionsEngine
	}) {

	if (!userIds.length)
		throw new Error("invalid: userIds cannot be empty")

	const conditions = or(...userIds.map(userId => ({equal: {userId}})))
	const accounts = await authTables.users.accounts.read({conditions})
	const profiles = await authTables.users.profiles.read({conditions})

	const publicRolesForUsers =
		await permissionsEngine
			.getPublicRolesForUsers(userIds.map(id => id.toString()))

	function assembleDetailsForEachUser(userId: Id) {
		const account = accounts.find(a => a.userId.toString() === userId.toString())
		const profile = profiles.find(p => p.userId.toString() === userId.toString())

		if (!account)
			throw new renraku.ApiError(404, `account not found for user id ${userId}`)

		if (!profile)
			throw new renraku.ApiError(404, `profile not found for user id ${userId}`)

		const roles = publicRolesForUsers
			.find(r => r.userId.toString() === userId.toString())
			.publicUserRoles

		const stats: UserStats = {
			joined: account.created,
		}

		return {
			userId: userId.toString(),
			profile: profileFromRow(profile),
			roles,
			stats,
		}
	}

	return userIds.map(assembleDetailsForEachUser)
}
