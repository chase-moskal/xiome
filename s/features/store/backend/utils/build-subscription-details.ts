
import Stripe from "stripe"
import {SubscriptionDetails} from "../../isomorphic/concepts.js"
import {SubscriptionTierRow} from "../database/types/rows/subscription-tier-row.js"
import {determineSubscriptionStatus} from "./determine-subscription-status.js"
import {derivePricingFromStripePrice} from "./subscription-object-compilation/derive-pricing-from-stripe-price.js"

export function buildSubscriptionDetails(
		subscription: Stripe.Subscription,
		price: Stripe.Price,
		tierRow: SubscriptionTierRow,
	): SubscriptionDetails {

	return {
		status: determineSubscriptionStatus(subscription),
		planId: tierRow?.planId.string,
		tierId: tierRow?.tierId.string,
		pricing: derivePricingFromStripePrice(price),
	}
}
