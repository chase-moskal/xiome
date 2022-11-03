
import Stripe from "stripe"
import {SubscriptionPricing} from "../../../isomorphic/concepts.js"

export function derivePricingFromStripePrice(
		stripePrice: Stripe.Price
	): SubscriptionPricing {

	return {
		stripePriceId: stripePrice.id,
		price: stripePrice.unit_amount,
		currency: stripePrice.currency as SubscriptionPricing["currency"],
		interval: stripePrice.recurring.interval as SubscriptionPricing["interval"]
	}
}
