
import {depend, maxLength, min, minLength, notWhitespace, number, schema, string} from "../../../../toolbox/darkvalley.js"
import {SubscriptionPlanDraft} from "../../api/tables/types/drafts/subscription-plan-draft.js"

export const validateSubscriptionPlanDraft = schema<SubscriptionPlanDraft>({
	label: depend(string(), minLength(1), maxLength(32), notWhitespace()),
	price: depend(number(), min(0)),
})
