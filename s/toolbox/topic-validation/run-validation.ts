
import {Validator} from "../darkvalley.js"
import {RenrakuError} from "renraku"

export function runValidation<xValue>(value: xValue, validator: Validator<xValue>) {
	const problems = validator(value)

	if (problems.length > 0)
		throw new RenrakuError(400, problems.join("; "))
	else
		return value
}
