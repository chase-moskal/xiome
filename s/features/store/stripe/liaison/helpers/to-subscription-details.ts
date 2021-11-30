
import {Stripe} from "stripe"
import {getStripeId} from "./get-stripe-id.js"
import {SubscriptionDetails} from "../types/subscription-details.js"

export const toSubscriptionDetails = (
			subscription: Partial<Stripe.Subscription>
		): SubscriptionDetails => ({

	id: subscription.id,
	status: subscription.status,
	current_period_end: subscription.current_period_end,
	productIds:
		subscription.items.data
			.map(data => getStripeId(data.price.product)),
})
