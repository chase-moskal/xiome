
import {asTopic} from "renraku/x/identities/as-topic.js"

import {UserAuth} from "../policies/types/user-auth.js"
import {find} from "../../../toolbox/dbby/dbby-mongo.js"
import {AuthApiOptions} from "../types/auth-api-options.js"
import {ProfileDraft} from "./personal/types/profile-draft.js"
import {validateProfileDraft} from "./personal/validate-profile-draft.js"
import {isUserAllowedToEditProfile} from "./personal/is-user-allowed-to-edit-profile.js"
import {throwProblems} from "../../../toolbox/topic-validation/throw-problems.js"

export const personalTopic = ({config}: AuthApiOptions) => asTopic<UserAuth>()({

	async setProfile({access, tables}, {userId, profileDraft}: {
			userId: string
			profileDraft: ProfileDraft
		}) {

		const allowed = isUserAllowedToEditProfile({
			access,
			config,
			tables,
		})
		if (!allowed) throw new Error("forbidden")

		throwProblems(validateProfileDraft(profileDraft))

		await tables.user.profile.update({
			...find({userId}),
			write: {
				nickname: profileDraft.nickname,
				tagline: profileDraft.tagline,
			},
		})
	},
})
