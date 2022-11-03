
import {SubscriptionPlan} from "../../../../isomorphic/concepts.js"

export function planIsNotArchived() {
	return (plan: SubscriptionPlan) => !plan.archived
}
