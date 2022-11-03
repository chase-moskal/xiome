
import {SubscriptionPlan} from "../../../../isomorphic/concepts.js"

export function planHasTiersThatAreActive() {

	return (plan: SubscriptionPlan) => plan
		.tiers
		.some(tier => tier.active)
}
