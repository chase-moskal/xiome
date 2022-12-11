
import {TierBasics} from "../../../views/tier/types.js"
import {SubscriptionDetails, SubscriptionPlan} from "../../../../isomorphic/concepts.js"

export function getOngoingSubscriptions({
		plans = [],
		mySubscriptionDetails = [],
	}: {
		plans?: SubscriptionPlan[]
		mySubscriptionDetails?: SubscriptionDetails[]
	}): TierBasics[] {

	return mySubscriptionDetails.map(subscription => {
		const plan
			= plans	
				.find(p => p.planId === subscription.planId)

		const tier
			= plan
				.tiers
				.find(t => t.tierId === subscription.tierId)

		return {
			plan,
			tier,
			subscription,
			pricing: subscription.pricing,
		}
	})
}
