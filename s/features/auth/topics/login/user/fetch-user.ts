
import {ApiError} from "renraku/x/api/api-error.js"

import {UserStats} from "../../../types/user-stats"
import {User} from "../../../types/user"
import {and} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {concurrent} from "../../../../../toolbox/concurrent.js"

import {profileFromRow} from "./profile-from-row.js"
import {generateProfileRow} from "./generate-profile-row.js"
import {fetchPublicUserRoles} from "./utils/fetch-public-user-roles.js"
import {AuthTables} from "../../../tables/types/auth-tables.js"

export async function fetchUser({userId, tables, generateNickname}: {
			userId: string
			tables: AuthTables
			generateNickname: () => string
		}): Promise<User> {

	const account = await tables.user.account.one({conditions: and({equal: {userId}})})
	if (!account) throw new ApiError(500, "user account not found")

	const stats: UserStats = {
		joined: account.created,
	}

	const {roles, profile} = await concurrent({
		roles: await fetchPublicUserRoles({userId, tables}),
		profile: profileFromRow(
			await tables.user.profile.assert({
				conditions: and({equal: {userId}}),
				make: async() => generateProfileRow({userId, generateNickname}),
			})
		),
	})

	return {userId, profile, roles, stats}
}
