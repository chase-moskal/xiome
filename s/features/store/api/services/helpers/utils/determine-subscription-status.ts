
import {Stripe} from "stripe"
import {SubscriptionStatus} from "../../../../types/store-concepts.js"

export function determineSubscriptionStatus(subscription: Stripe.Subscription) {

	if (!subscription)
		return SubscriptionStatus.Unsubscribed

	const {status, cancel_at_period_end} = subscription

	return status === "active"
		? SubscriptionStatus.Active
		: cancel_at_period_end
			? SubscriptionStatus.Cancelled
			: SubscriptionStatus.Unpaid
}
