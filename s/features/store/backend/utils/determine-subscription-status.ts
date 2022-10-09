
import {Stripe} from "stripe"
import {SubscriptionStatus} from "../../isomorphic/concepts.js"

export function determineSubscriptionStatus(
		subscription: Stripe.Subscription
	) {

	if (!subscription)
		return SubscriptionStatus.Unsubscribed

	const {status, cancel_at_period_end} = subscription

	return cancel_at_period_end
		? SubscriptionStatus.Cancelled
		: status === "active"
			? SubscriptionStatus.Active
			: SubscriptionStatus.Unpaid
}
