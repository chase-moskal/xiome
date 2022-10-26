
import {SubscriptionPlanRow} from "../../database/types/rows/subscription-plan-row.js"
import {SubscriptionTierRow} from "../../database/types/rows/subscription-tier-row.js"

export function isTierBelongingToPlan(
		planRow: SubscriptionPlanRow,
		tierRow: SubscriptionTierRow,
	) {

	return planRow.planId.equals(tierRow.planId)
}
