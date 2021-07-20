
import {ProfileDraft} from "./types/profile-draft.js"
import {string, minLength, maxLength, notWhitespace, schema, one} from "../../../../toolbox/darkvalley.js"

export const profileValidators = {
	nickname: one(
		string(),
		minLength(1),
		maxLength(24),
		notWhitespace(),
	),
	tagline: one(
		string(),
		minLength(0),
		maxLength(32),
		notWhitespace(),
	),
}

export const validateProfileDraft = schema<ProfileDraft>({
	...profileValidators,
})
