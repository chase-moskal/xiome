
import {maxLength, minLength, notWhitespace, validator, string} from "../../../../../../../toolbox/darkvalley.js"

export const roleLabelValidator = validator<string>(
	string(),
	minLength(1),
	maxLength(16),
	notWhitespace(),
)
