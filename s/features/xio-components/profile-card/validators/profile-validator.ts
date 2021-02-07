
import {validator, depend as d, string, minLength, maxLength, notWhitespace} from "../../../../toolbox/darkvalley.js"

export const profileValidator = Object.freeze({
	nickname: validator<string>(d(
		string(),
		minLength(1),
		maxLength(24),
		notWhitespace(),
	)),
	tagline: validator<string>(d(
		string(),
		minLength(0),
		maxLength(32),
		notWhitespace(),
	)),
})
