
import {maxLength, minLength, validator, string} from "../../../../../toolbox/darkvalley.js"

export const validateUserSearchTerm = validator<string>(
	string(),
	minLength(1),
	maxLength(64),
)
