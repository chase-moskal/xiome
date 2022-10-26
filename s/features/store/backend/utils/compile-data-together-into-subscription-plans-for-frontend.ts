
import Stripe from "stripe"

import {compileTiers} from "./subscription-object-compilation/compile-tiers.js"
import {SubscriptionPlanRow} from "../database/types/rows/subscription-plan-row.js"
import {SubscriptionTierRow} from "../database/types/rows/subscription-tier-row.js"
import {sortPlansByAscendingTime} from "./subscription-object-compilation/sort-plans-by-ascending-time.js"
import {sortTiersByAscendingPrice} from "./subscription-object-compilation/sort-tiers-by-ascending-price.js"

export async function compileDataTogetherIntoSubscriptionPlansForFrontend({
		planRows, tierRows, stripePrices, stripeProducts,
	}: {
		planRows: SubscriptionPlanRow[]
		tierRows: SubscriptionTierRow[]
		stripePrices: Stripe.Response<Stripe.Price>[]
		stripeProducts: Stripe.Response<Stripe.Product>[]
	}) {

	return planRows
		.map(planRow => ({
			archived: planRow.archived ?? false,
			label: planRow.label,
			planId: planRow.planId.string,
			time: planRow.time,
			tiers: compileTiers(
				tierRows,
				planRow,
				stripeProducts,
				stripePrices,
			).sort(sortTiersByAscendingPrice)
		})).sort(sortPlansByAscendingTime)
}
