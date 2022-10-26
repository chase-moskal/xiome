
import {SubscriptionPlan} from "../../../isomorphic/concepts.js"

export function sortPlansByAscendingTime(
		a: SubscriptionPlan,
		b: SubscriptionPlan,
	) {

	return a.time - b.time
}
