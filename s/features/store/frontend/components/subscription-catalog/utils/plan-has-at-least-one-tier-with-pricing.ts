
import {SubscriptionPlan} from "../../../../isomorphic/concepts.js"

export function planHasAtLeastOneTierWithPricing(
		plan: SubscriptionPlan
	) {

	return plan
		.tiers
		.some(tier => !!tier.pricing)
}
