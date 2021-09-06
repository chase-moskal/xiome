
import {ProfileDraft} from "./types/profile-draft.js"
import {string, minLength, maxLength, notWhitespace, schema, validator} from "../../../../../../toolbox/darkvalley.js"

export const profileValidators = {
	nickname: validator(
		string(),
		minLength(1),
		maxLength(24),
		notWhitespace(),
	),
	tagline: validator(
		string(),
		minLength(0),
		maxLength(32),
		notWhitespace(),
	),
}

export const validateProfileDraft = schema<ProfileDraft>({
	...profileValidators,
})
