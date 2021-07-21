
import {Profile} from "../../../auth/aspects/users/types/profile.js"
import {ProfileDraft} from "../../../auth/aspects/users/routines/personal/types/profile-draft.js"

export function makeProfileDraft(profile: Profile): ProfileDraft {
	return {
		tagline: profile.tagline,
		nickname: profile.nickname,
	}
}
