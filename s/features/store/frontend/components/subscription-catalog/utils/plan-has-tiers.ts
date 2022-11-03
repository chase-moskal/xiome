
import {SubscriptionPlan} from "../../../../isomorphic/concepts.js"

export function planHasTiers() {
	return (plan: SubscriptionPlan) => plan.tiers.length > 0
}
