
import {TierBasics, TierContext} from "../types.js"
import {SubscriptionStatus} from "../../../../isomorphic/concepts.js"

export function ascertainTierContext({
		tier,
		plan,
		subscription,
	}: TierBasics): TierContext {

	const {tierId} = tier

	const tierIndex = (
		plan
			.tiers
			.findIndex(t => t.tierId === tierId)
	)

	const subscribedTierIndex = subscription && (
		plan
			.tiers
			.findIndex(t => t.tierId === subscription.tierId)
	)

	const isSubscribedToThisTier = !!subscription && (
		tierIndex === subscribedTierIndex
	)

	const status = isSubscribedToThisTier
		? (
			subscription?.status
				?? SubscriptionStatus.Unsubscribed
		)
		: SubscriptionStatus.Unsubscribed

	const isAnotherTierInPlanUnpaid = (
		subscription
			&& !isSubscribedToThisTier
			&& subscription.status === SubscriptionStatus.Unpaid
	)

	return {
		subscription,
		status,
		tierIndex,
		subscribedTierIndex,
		isSubscribedToThisTier,
		isAnotherTierInPlanUnpaid,
	}
}
