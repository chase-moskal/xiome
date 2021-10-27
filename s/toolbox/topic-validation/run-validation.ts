
import {Validator} from "../darkvalley.js"
import {ApiError} from "renraku/x/api/api-error.js"

export function runValidation<xValue>(value: xValue, validator: Validator<xValue>) {
	const problems = validator(value)

	if (problems.length > 0)
		throw new ApiError(400, problems.join("; "))
	else
		return value
}
