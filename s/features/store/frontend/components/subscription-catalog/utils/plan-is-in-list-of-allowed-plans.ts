
import {SubscriptionPlan} from "../../../../isomorphic/concepts.js"

export function planIsInListOfAllowedPlans(
		planIds: string
	) {	

	const allowedPlans = planIds
		?.match(/(\w+)/g)

	return (plan: SubscriptionPlan) => {
		return !!allowedPlans
			? allowedPlans.includes(plan.planId)
			: true
	}
}
