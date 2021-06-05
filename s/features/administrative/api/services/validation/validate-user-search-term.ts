
import {maxLength, minLength, one, string, validator} from "../../../../../toolbox/darkvalley.js"

export const validateUserSearchTerm = validator<string>(one(
	string(),
	minLength(1),
	maxLength(48),
))

// export const validateUserSearchTerm = validator<string>(
// 	one(
// 		string(),
// 		minLength(1),
// 		branch(
// 			profileValidators.nickname,
// 			profileValidators.tagline,
// 			validateId,
// 		)
// 	)
// )
