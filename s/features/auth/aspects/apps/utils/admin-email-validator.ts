
import {validator, string, maxLength, email} from "../../../../../toolbox/darkvalley.js"

export const emailValidator = validator<string>(
	string(),
	maxLength(256),
	email(),
)
