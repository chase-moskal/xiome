
import {maxLength, minLength, notWhitespace, one, string} from "../../../../../toolbox/darkvalley.js"

export const roleLabelValidator = one<string>(
	string(),
	minLength(1),
	maxLength(16),
	notWhitespace(),
)
