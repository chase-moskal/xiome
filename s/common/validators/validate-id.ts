
import {length, validator, regex, string} from "../../toolbox/darkvalley.js"

export const validateId = validator<string>(
	string(),
	length(64),
	regex(/^[0-9a-z]{64}$/),
)
