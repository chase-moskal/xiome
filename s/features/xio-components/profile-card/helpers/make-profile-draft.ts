
import {Profile} from "../../../auth2/aspects/users/types/profile.js"
import {ProfileDraft} from "../../../auth2/aspects/users/routines/personal/types/profile-draft.js"

export function makeProfileDraft(profile: Profile): ProfileDraft {
	return {
		tagline: profile.tagline,
		nickname: profile.nickname,
	}
}
