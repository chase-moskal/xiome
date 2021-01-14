
import {asTopic} from "renraku/x/identities/as-topic.js"

import {find} from "../../../toolbox/dbby/dbby-mongo.js"
import {validateProfile} from "../topics/personal/validate-profile.js"
import {UserAuth, AccessPayload, AuthOptions, AppPayload, AuthTables, PlatformConfig, Profile} from "../auth-types.js"

export const personalTopic = ({config,}: AuthOptions) => asTopic<UserAuth>()({

	async setProfile({access, app, tables}, {userId, profile}: {
			userId: string
			profile: Profile
		}) {

		const allowed = isUserAllowedToEditProfile({
			app,
			access,
			config,
			tables,
		})
		if (!allowed) throw new Error("forbidden")

		const {problems} = validateProfile(profile)
		if (problems.length) throw new Error(`invalid profile: ${problems.join("; ")}`)

		await tables.profile.update({
			...find({userId}),
			write: profile,
		})
	},
})

function isUserAllowedToEditProfile({app, access}: {
		app: AppPayload
		tables: AuthTables
		access: AccessPayload
		config: PlatformConfig
	}) {
	// TODO implement
	return true
}
