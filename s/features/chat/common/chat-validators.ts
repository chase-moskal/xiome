
import {validateId} from "../../../common/validators/validate-id.js"
import {each, max, maxLength, min, minLength, number, schema, string, validator, zeroWhitespace} from "../../../toolbox/darkvalley.js"

export const validateRoom = validator(
	string(),
	minLength(1),
	maxLength(32),
	zeroWhitespace(),
)

export const validateDraft = schema<{
	content: string
}>({
	content: validator(
		string(),
	)
})

export const validateUserIds = validator(
	each(validateId)
)

export const validatePostIds = validator(
	each(validateId)
)

export const validateStatus = validator(
	number(),
	min(0),
	max(1)
)
