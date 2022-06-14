
import Stripe from "stripe"
import {SubscriptionDetails} from "../types.js"
import {getStripeId} from "./get-stripe-id.js"

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
