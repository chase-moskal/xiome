
import {ApiError} from "renraku/x/api/api-error.js"
import {apiContext} from "renraku/x/api/api-context.js"

import {AuthOptions} from "../../../types/auth-options.js"
import {AnonAuth, AnonMeta} from "../../../types/auth-metas.js"
import {find} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {ProfileDraft} from "../routines/personal/types/profile-draft.js"
import {validateProfileDraft} from "../routines/personal/validate-profile-draft.js"
import {throwProblems} from "../../../../../toolbox/topic-validation/throw-problems.js"

export const makePersonalService = (
		options: AuthOptions
	) => apiContext<AnonMeta, AnonAuth>()({
	policy: options.authPolicies.userPolicy,
	expose: {

		async setProfile({access, authTables, checker}, {userId: userIdString, profileDraft}: {
				userId: string
				profileDraft: ProfileDraft
			}) {

			const userId = DamnId.fromString(userIdString)
			const isProfileOwner = access.user.userId === userIdString
			const canEditAnyProfile = checker.hasPrivilege("edit any profile")
			const allowed = isProfileOwner || canEditAnyProfile

			if (!allowed)
				throw new ApiError(403, "forbidden: you are not allowed to edit this profile")

			throwProblems(validateProfileDraft(profileDraft))

			await authTables.users.profiles.update({
				...find({userId}),
				write: {
					nickname: profileDraft.nickname,
					tagline: profileDraft.tagline,
				},
			})
		},
	},
})
