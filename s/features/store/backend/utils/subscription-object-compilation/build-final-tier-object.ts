
import Stripe from "stripe"

import {SubscriptionTier} from "../../../isomorphic/concepts.js"
import {derivePricingFromStripePrice} from "./derive-pricing-from-stripe-price.js"
import {SubscriptionTierRow} from "../../database/types/rows/subscription-tier-row.js"
import {isStripePriceValidForSubscriptionUsage} from "../is-stripe-price-valid-for-subscription-usage.js"

export function buildFinalTierObject(
		tierRow: SubscriptionTierRow,
		stripePrice: Stripe.Response<Stripe.Price>,
		stripeProduct: Stripe.Response<Stripe.Product>,
	): SubscriptionTier {

	return {
		tierId: tierRow.tierId.string,
		roleId: tierRow.roleId.string,
		label: stripeProduct.name,
		time: tierRow.time,
		active: stripeProduct.active,
		pricing: isStripePriceValidForSubscriptionUsage(stripePrice)
			? [derivePricingFromStripePrice(stripePrice)]
			: undefined
	}
}
