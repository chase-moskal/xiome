
import {Stripe} from "stripe"
import {SubscriptionDetails} from "../types/subscription-details.js"

export const toSubscriptionDetails = (
		subscription: Partial<Stripe.Subscription>
	): SubscriptionDetails => ({

	status: subscription.status,
	current_period_end: subscription.current_period_end,
})
