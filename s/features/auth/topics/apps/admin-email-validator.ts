
import {validator, one, string, maxLength, email} from "../../../../toolbox/darkvalley.js"

export const emailValidator = validator<string>(one(
	string(),
	maxLength(256),
	email(),
))
