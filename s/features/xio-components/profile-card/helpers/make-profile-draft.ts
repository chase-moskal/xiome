
import {Profile} from "../../../auth/types/profile.js"
import {ProfileDraft} from "../../../auth/topics/personal/types/profile-draft.js"

export function makeProfileDraft(profile: Profile): ProfileDraft {
	return {
		tagline: profile.tagline,
		nickname: profile.nickname,
	}
}
