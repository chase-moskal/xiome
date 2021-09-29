
import {maxLength, minLength, string, validator} from "../../../../../toolbox/darkvalley.js"

export const validatePermissionsLabel = validator(
	string(),
	minLength(1),
	maxLength(32),
)
