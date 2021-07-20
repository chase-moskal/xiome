
import {SubscriptionPlanDraft} from "../../tables/types/drafts/subscription-plan-draft.js"
import {depend, maxLength, min, minLength, notWhitespace, number, schema, string} from "../../../../../toolbox/darkvalley.js"

export const validateSubscriptionPlanDraft = schema<SubscriptionPlanDraft>({
	label: depend(string(), minLength(1), maxLength(32), notWhitespace()),
	price: depend(number(), min(0)),
})
