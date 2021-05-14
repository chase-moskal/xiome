
import {ApiError} from "renraku/x/api/api-error.js"
import {asTopic} from "renraku/x/identities/as-topic.js"

import {UserAuth} from "../policies/types/user-auth.js"
import {find} from "../../../toolbox/dbby/dbby-mongo.js"
import {AuthApiOptions} from "../types/auth-api-options.js"
import {ProfileDraft} from "./personal/types/profile-draft.js"
import {validateProfileDraft} from "./personal/validate-profile-draft.js"
import {throwProblems} from "../../../toolbox/topic-validation/throw-problems.js"

export const personalTopic = ({config}: AuthApiOptions) => asTopic<UserAuth>()({

	async setProfile({access, tables, checker}, {userId, profileDraft}: {
			userId: string
			profileDraft: ProfileDraft
		}) {

		const isProfileOwner = access.user.userId === userId
		const canEditAnyProfile = checker.hasPrivilege("edit any profile")
		const allowed = isProfileOwner || canEditAnyProfile

		if (!allowed)
			throw new ApiError(403, "forbidden: you are not allowed to edit this profile")

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
