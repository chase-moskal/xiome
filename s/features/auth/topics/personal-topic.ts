
import {asTopic} from "renraku/x/identities/as-topic.js"

import {find} from "../../../toolbox/dbby/dbby-mongo.js"
import {validateProfile} from "./personal/validate-profile.js"
import {UserAuth, AuthOptions, Profile} from "../auth-types.js"
import {isUserAllowedToEditProfile} from "./personal/is-user-allowed-to-edit-profile.js"

export const personalTopic = ({config}: AuthOptions) => asTopic<UserAuth>()({

	async setProfile({access, app: app, tables}, {userId, profile}: {
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
