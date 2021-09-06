
import {validator, branch, string, array, each, minLength, maxLength, notWhitespace, url, https, localhost, origin} from "../../../../../toolbox/darkvalley.js"

const validateAppOrigin = validator(
	string(),
	maxLength(1000),
	origin(),
	branch(https(), localhost()),
)

export const appDraftValidators = Object.freeze({
	home: validator<string>(
		string(),
		minLength(1),
		maxLength(2000),
		branch(validator(url(), https()), localhost()),
	),
	label: validator<string>(
		string(),
		minLength(1),
		maxLength(50),
		notWhitespace(),
	),
	origins: validator<string[]>(
		minLength(1),
		maxLength(100),
		each(validateAppOrigin),
	),
	additionalOrigins: validator<string[]>(
		array(),
		minLength(0),
		maxLength(99),
		each(validateAppOrigin),
	),
})
