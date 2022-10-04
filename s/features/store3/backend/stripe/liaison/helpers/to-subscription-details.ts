
import Stripe from "stripe"
import {getStripeId} from "./get-stripe-id.js"
import {SubscriptionData} from "../types.js"

export const toSubscriptionDetails = (
			subscription: Partial<Stripe.Subscription>
		): SubscriptionData => ({

	id: subscription.id,
	status: subscription.status,
	current_period_end: subscription.current_period_end,
	productIds:
		subscription.items.data
			.map(data => getStripeId(data.price.product)),
})
