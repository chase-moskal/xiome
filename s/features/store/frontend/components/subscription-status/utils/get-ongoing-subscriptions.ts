
import {StoreModel} from "../../../model/model.js"
import {TierBasics} from "../../../views/tier/types.js"

export function getOngoingSubscriptions(storeModel: StoreModel): TierBasics[] {

	return (storeModel
		.get
		.subscriptions
		.mySubscriptionDetails ?? [])
		.map(subscription => {

			const plan = (
				storeModel
					.get
					.subscriptions
					.plans
					.find(p => p.planId === subscription.planId)
			)

			const tier = (
				plan
					.tiers
					.find(t => t.tierId === subscription.tierId)
			)

			return {
				plan,
				tier,
				subscription,
				pricing: subscription.pricing,
			}
		})
}
