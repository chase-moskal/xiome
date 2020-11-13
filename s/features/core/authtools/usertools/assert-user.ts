
import {concurrent} from "../../../../toolbox/concurrent.js"
import {and} from "../../../../toolbox/dbby/dbby-helpers.js"

import {fetchTags} from "./more/fetch-tags.js"
import {CoreTables, User} from "../../core-types.js"
import {profileFromRow} from "./more/profile-from-row.js"
import {makeDefaultProfile} from "./more/make-default-profile.js"

export async function assertUser({userId, tables, generateNickname}: {
			userId: string
			tables: CoreTables
			generateNickname: () => string
		}): Promise<User> {

	const {tags, profile} = await concurrent({
		tags: await fetchTags(userId),
		profile: profileFromRow(
			await tables.profile.assert({
				conditions: and({equal: {userId}}),
				make: async() => makeDefaultProfile(userId, generateNickname),
			})
		),
	})

	return {userId, tags, profile}
}
