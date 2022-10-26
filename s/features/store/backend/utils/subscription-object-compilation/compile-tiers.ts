
import Stripe from "stripe"

import {getStripeId} from "../../stripe/utils/get-stripe-id.js"
import {buildFinalTierObject} from "./build-final-tier-object.js"
import {isTierBelongingToPlan} from "./is-tier-belonging-to-plan.js"
import {SubscriptionPlanRow} from "../../database/types/rows/subscription-plan-row.js"
import {SubscriptionTierRow} from "../../database/types/rows/subscription-tier-row.js"
import {isTierAttachedToExistingStripeProduct} from "./is-tier-attached-to-existing-stripe-product.js"

export function compileTiers(
		tierRows: SubscriptionTierRow[],
		planRow: SubscriptionPlanRow,
		stripeProducts: Stripe.Response<Stripe.Product>[],
		stripePrices: Stripe.Response<Stripe.Price>[],
	) {

	const stripeProductIds = (
		stripeProducts
			.map(product => getStripeId(product.id))
	)

	function findPriceForTier(tierRow: SubscriptionTierRow) {
		return stripePrices
			.find(price =>
				getStripeId(price?.product) === tierRow.stripeProductId
			)
	}

	function findProductForTier(tierRow: SubscriptionTierRow) {
		return stripeProducts
			.find(product =>
				getStripeId(product.id) === tierRow.stripeProductId
			)
	}

	return tierRows

		.filter(tierRow =>
			isTierBelongingToPlan(
				planRow,
				tierRow,
			)
		)

		.filter(tierRow =>
			isTierAttachedToExistingStripeProduct(
				tierRow,
				stripeProductIds
			)
		)

		.map(tierRow => buildFinalTierObject(
			tierRow,
			findPriceForTier(tierRow),
			findProductForTier(tierRow),
		))
}
