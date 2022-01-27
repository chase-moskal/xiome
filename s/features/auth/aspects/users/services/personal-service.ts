
import * as renraku from "renraku"
import {Id, find} from "dbmage"

import {AuthOptions} from "../../../types/auth-options.js"
import {ProfileDraft} from "../routines/personal/types/profile-draft.js"
import {validateProfileDraft} from "../routines/personal/validate-profile-draft.js"
import {throwProblems} from "../../../../../toolbox/topic-validation/throw-problems.js"

export const makePersonalService = (options: AuthOptions) => renraku.service()

.policy(options.authPolicies.userPolicy)

.expose(({access, database, checker}) => ({

	async setProfile({userId: userIdString, profileDraft}: {
			userId: string
			profileDraft: ProfileDraft
		}) {

		const userId = Id.fromString(userIdString)
		const isProfileOwner = access.user.userId === userIdString
		const canEditAnyProfile = checker.hasPrivilege("edit any profile")
		const allowed = isProfileOwner || canEditAnyProfile

		if (!allowed)
			throw new renraku.ApiError(403, "forbidden: you are not allowed to edit this profile")

		throwProblems(validateProfileDraft(profileDraft))

		await database.tables.auth.users.profiles.update({
			...find({userId}),
			write: {
				nickname: profileDraft.nickname,
				tagline: profileDraft.tagline,
			},
		})
	},
}))
