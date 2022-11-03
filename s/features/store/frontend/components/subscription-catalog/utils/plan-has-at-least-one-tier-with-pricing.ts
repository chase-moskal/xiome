
import {SubscriptionPlan} from "../../../../isomorphic/concepts.js"

export function planHasAtLeastOneTierWithPricing() {

	return (plan: SubscriptionPlan) => plan
		.tiers
		.some(tier => !!tier.pricing)
}
