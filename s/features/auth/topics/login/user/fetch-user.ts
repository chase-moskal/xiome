
import {ApiError} from "renraku/x/api/api-error.js"

import {AuthTables, User} from "../../../auth-types.js"
import {concurrent} from "../../../../../toolbox/concurrent.js"
import {and} from "../../../../../toolbox/dbby/dbby-helpers.js"

import {fetchTags} from "./fetch-tags.js"
import {profileFromRow} from "./profile-from-row.js"
import {generateProfileRow} from "./generate-profile-row.js"

export async function fetchUser({userId, tables, generateNickname}: {
			userId: string
			tables: AuthTables
			generateNickname: () => string
		}): Promise<User> {

	const account = await tables.account.one({conditions: and({equal: {userId}})})
	if (!account) throw new ApiError(500, "user account not found")

	const {tags, profile} = await concurrent({
		tags: await fetchTags(userId),
		profile: profileFromRow(
			await tables.profile.assert({
				conditions: and({equal: {userId}}),
				make: async() => generateProfileRow({userId, generateNickname}),
			})
		),
	})

	return {userId, tags, profile}
}
