
import {length, one, regex, string, validator} from "../../../../../toolbox/darkvalley.js"

export const validateId = validator<string>(one(
	string(),
	length(64),
	regex(/^[0-9a-z]{64}$/),
))
