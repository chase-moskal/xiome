
import {string, each, length, minLength, maxLength, notWhitespace, origin, validator} from "../../../../../toolbox/darkvalley.js"

export const appTokenDraftValidators = Object.freeze({
	appId: validator<string>(
		string(),
		length(64),
	),
	label: validator<string>(
		string(),
		minLength(1),
		maxLength(50),
		notWhitespace(),
	),
	origins: validator<string[]>(
		each(string(), origin(), maxLength(1000)),
		minLength(1),
		maxLength(100),
	),
})
