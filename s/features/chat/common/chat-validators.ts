
import {maxLength, minLength, string, validator, zeroWhitespace} from "../../../toolbox/darkvalley.js"

export const validateRoom = validator(
	string(),
	minLength(1),
	maxLength(32),
	zeroWhitespace(),
)
