
import {goodApiKey} from "../../dacast/mocks/parts/mock-dacast-constants.js"
import {Validator, validator, string, minLength, maxLength, zeroWhitespace} from "../../../../toolbox/darkvalley.js"

export const validateDacastApiKey = validator<string>(
	validator(
		string(),
		minLength(16),
		maxLength(64),
		zeroWhitespace(),
	)
)

export const validateDacastApiKeyAllowingMock: Validator<string> = value =>
	value === goodApiKey
		? []
		: validateDacastApiKey(value)
