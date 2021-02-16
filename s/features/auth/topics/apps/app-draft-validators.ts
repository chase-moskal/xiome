
import {validator, one, branch, string, array, each, minLength, maxLength, notWhitespace, url, https, localhost, origin} from "../../../../toolbox/darkvalley.js"

const validateAppOrigin = one(
	string(),
	maxLength(1000),
	origin(),
	branch(https(), localhost()),
)

export const appDraftValidators = Object.freeze({
	home: validator<string>(one(
		string(),
		minLength(1),
		maxLength(2000),
		branch(one(url(), https()), localhost()),
	)),
	label: validator<string>(one(
		string(),
		minLength(1),
		maxLength(50),
		notWhitespace(),
	)),
	origins: validator<string[]>(one(
		minLength(1),
		maxLength(100),
		each(validateAppOrigin),
	)),
	additionalOrigins: validator<string[]>(one(
		array(),
		minLength(0),
		maxLength(99),
		each(validateAppOrigin),
	)),
})
