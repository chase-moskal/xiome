
import {length, one, string, validator} from "../../../../../toolbox/darkvalley.js"

export const validateId = validator<string>(one(
	string(),
	length(48),
))
