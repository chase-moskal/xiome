
import {ApiError} from "renraku/x/api/api-error.js"

import {UserStats} from "../../types/user-stats.js"
import {PrivateUser, User} from "../../types/user.js"
import {profileFromRow} from "../profile/profile-from-row.js"
import {FetchUserOptions} from "./types/fetch-user-options.js"
import {or} from "../../../../../../toolbox/dbby/dbby-helpers.js"
import {concurrent} from "../../../../../../toolbox/concurrent.js"
import {DamnId} from "../../../../../../toolbox/damnedb/damn-id.js"

function getConditions(userIds: DamnId[]) {
	return or(...userIds.map(userId => ({equal: {userId}})))
}

async function prepareUserAssembler({
		userIds, authTables, permissionsEngine,
	}: FetchUserOptions) {

	if (!userIds.length)
		throw new Error("invalid: userIds cannot be empty")

	const conditions = getConditions(userIds)

	const {accounts, profiles, publicRolesForUsers} = await concurrent({
		accounts: authTables.users.accounts.read({conditions}),
		profiles: authTables.users.profiles.read({conditions}),
		publicRolesForUsers:
			permissionsEngine
				.getPublicRolesForUsers(userIds.map(id => id.toString())),
	})

	return function assembleUser(userId: DamnId): User {
		const account = accounts.find(r => r.userId.toString() === userId.toString())
		const profile = profiles.find(r => r.userId.toString() === userId.toString())

		if (!account)
			throw new ApiError(404, `account not found for user id ${userId}`)
	
		if (!profile)
			throw new ApiError(404, `profile not found for user id ${userId}`)

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
}

export async function fetchPrivateUsers(options: FetchUserOptions): Promise<PrivateUser[]> {
	const {userIds, authTables} = options
	const conditions = getConditions(userIds)
	const {assembleUser, emailRows} = await concurrent({
		assembleUser: prepareUserAssembler(options),
		emailRows: authTables.users.emails.read({conditions})
	})
	return userIds.map(userId => {
		const emailRow = emailRows.find(r => r.userId.toString() === userId.toString())
		const user = assembleUser(userId)
		if (!emailRow)
			throw new ApiError(404, `email not found for user id ${userId}`)
		return {
			...user,
			email: emailRow.email,
		}
	})
}

export async function fetchUsers(options: FetchUserOptions) {
	const {userIds} = options
	const assembleUser = await prepareUserAssembler(options)
	return userIds.map(assembleUser)
}
