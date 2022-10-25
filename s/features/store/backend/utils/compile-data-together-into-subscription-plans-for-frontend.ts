
import Stripe from "stripe"

import {getStripeId} from "../stripe/utils/get-stripe-id.js"
import {SubscriptionPricing} from "../../isomorphic/concepts.js"
import {SubscriptionPlanRow} from "../database/types/rows/subscription-plan-row.js"
import {SubscriptionTierRow} from "../database/types/rows/subscription-tier-row.js"


export async function compileDataTogetherIntoSubscriptionPlansForFrontend({
		planRows, tierRows, stripePrices, stripeProducts
	}: {
		planRows: SubscriptionPlanRow[]
		tierRows: SubscriptionTierRow[]
		stripePrices: Stripe.Response<Stripe.Price>[]
		stripeProducts: Stripe.Response<Stripe.Product>[]
	}) {

	const stripeProductIds = stripeProducts
		.map(product => getStripeId(product.id))

	return planRows
		.map(planRow => ({
			archived: planRow.archived ?? false,
			label: planRow.label,
			planId: planRow.planId.string,
			time: planRow.time,
			tiers: tierRows
				.filter(row => planRow.planId.equals(row.planId))
				.filter(row => stripeProductIds.includes(row.stripeProductId))
				.map(row => {
					const stripePrice = stripePrices
						.find(price => getStripeId(price?.product) === row.stripeProductId)
					const stripeProduct = stripeProducts
						.find(product => getStripeId(product.id) === row.stripeProductId)
					return {
						tierId: row.tierId.string,
						roleId: row.roleId.string,
						label: row.label,
						time: row.time,
						active: stripeProduct.active,
						pricing: stripePrice && [{
							stripePriceId: stripePrice.id,
							price: stripePrice.unit_amount,
							currency: stripePrice.currency as SubscriptionPricing["currency"],
							interval: stripePrice.recurring.interval as SubscriptionPricing["interval"]
						}]
					}
				})
				.sort((tierA, tierB) => tierA.pricing[0].price - tierB.pricing[0].price)
		}))
		.sort((planA, planB) => planA.time - planB.time)
}
