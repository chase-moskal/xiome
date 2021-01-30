
import {validator, string, array, minLength, maxLength, notWhitespace, url, origin} from "../../../../toolbox/darkvalley.js"

export const appDraftValidators = {
	home: validator<string>(
		string(),
		minLength(1),
		maxLength(2000),
		url(),
	),
	label: validator<string>(
		string(),
		minLength(1),
		maxLength(50),
		notWhitespace(),
	),
	origins: validator<string[]>(
		array(string(), origin(), maxLength(1000)),
		minLength(1),
		maxLength(100),
	),
}
