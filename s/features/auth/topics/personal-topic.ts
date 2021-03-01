
import {asTopic} from "renraku/x/identities/as-topic.js"

import {find} from "../../../toolbox/dbby/dbby-mongo.js"
import {validateProfile} from "./personal/validate-profile.js"
import {Profile} from "../types/profile.js"
import {UserAuth} from "../policies/types/user-auth.js"
import {AuthApiOptions} from "../types/auth-api-options"
import {isUserAllowedToEditProfile} from "./personal/is-user-allowed-to-edit-profile.js"

export const personalTopic = ({config}: AuthApiOptions) => asTopic<UserAuth>()({

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

		await tables.user.profile.update({
			...find({userId}),
			write: profile,
		})
	},
})
