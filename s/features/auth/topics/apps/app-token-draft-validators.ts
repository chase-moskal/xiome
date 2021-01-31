
import {validator, depend as d, string, array, length, minLength, maxLength, notWhitespace, origin} from "../../../../toolbox/darkvalley.js"

export const appTokenDraftValidators = Object.freeze({
	appId: validator<string>(d(
		string(),
		length(64),
	)),
	label: validator<string>(d(
		string(),
		minLength(1),
		maxLength(50),
		notWhitespace(),
	)),
	origins: validator<string[]>(d(
		array(d(string(), origin(), maxLength(1000))),
		minLength(1),
		maxLength(100),
	)),
})
