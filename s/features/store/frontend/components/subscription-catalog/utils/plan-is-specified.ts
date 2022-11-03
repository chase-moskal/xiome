
import {SubscriptionPlan} from "../../../../isomorphic/concepts.js"

export function planIsSpecified(
		specifiedPlans: string[]
	) {

	return (plan: SubscriptionPlan) => (
		specifiedPlans.length > 0
			? specifiedPlans.includes(plan.planId)
			: true
	)
}
