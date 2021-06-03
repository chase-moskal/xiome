
import {validator, depend as d, string, each, length, minLength, maxLength, notWhitespace, origin} from "../../../../toolbox/darkvalley.js"

export const appTokenDraftValidators = Object.freeze({
	appId: validator<string>(d(
		string(),
		length(48),
	)),
	label: validator<string>(d(
		string(),
		minLength(1),
		maxLength(50),
		notWhitespace(),
	)),
	origins: validator<string[]>(d(
		each(d(string(), origin(), maxLength(1000))),
		minLength(1),
		maxLength(100),
	)),
})
