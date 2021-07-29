
import {maxLength, minLength, one, string, validator} from "../../../../../toolbox/darkvalley.js"

export const validateUserSearchTerm = validator<string>(one(
	string(),
	minLength(1),
	maxLength(64),
))
