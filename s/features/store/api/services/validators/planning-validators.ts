
import {validateId} from "../../../../../common/validators/validate-id.js"
import {boolean, branch, is, max, maxLength, min, minLength, number, regex, schema, string, validator, zeroWhitespace} from "../../../../../toolbox/darkvalley.js"
import {EditPlanDraft, EditTierDraft} from "../../../components/subscription-planning/types/planning-types.js"

export const validatePriceString = validator<string>(
	string(),
	maxLength(8),
	minLength(1),
	zeroWhitespace(),
	regex(/[\d\.]+/, "must be a number"),
)

export const validatePriceNumber = validator<number>(
	number(),
	min(0.01),
)

export const validateLabel = validator<string>(
	string(),
	minLength(1),
	maxLength(32),
)

export const validateCurrency = validator<"usd">(
	string(),
	branch(
		is("usd"),
	),
)

export const validateInterval = validator<"month" | "year">(
	string(),
	branch(
		is("month"),
		is("year"),
	),
)

export const validateBoolean = validator<boolean>(
	boolean(),
)

export const validateEditPlanDraft = schema<EditPlanDraft>({
	planId: validateId,
	label: validateLabel,
	active: validateBoolean,
})

export const validateEditTierDraft = schema<EditTierDraft>({
	tierId: validateId,
	label: validateLabel,
	active: validateBoolean,
	price: validatePriceNumber,
})
