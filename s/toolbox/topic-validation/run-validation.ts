
import * as renraku from "renraku"
import {Validator} from "../darkvalley.js"

export function runValidation<xValue>(value: xValue, validator: Validator<xValue>) {
	const problems = validator(value)

	if (problems.length > 0)
		throw new renraku.ApiError(400, problems.join("; "))
	else
		return value
}
