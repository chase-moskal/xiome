
import {validator, depend as d, string, array, minLength, maxLength, notWhitespace, url, origin} from "../../../../toolbox/darkvalley.js"

export const appDraftValidators = Object.freeze({
	home: validator<string>(d(
		string(),
		minLength(1),
		maxLength(2000),
		url(),
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
