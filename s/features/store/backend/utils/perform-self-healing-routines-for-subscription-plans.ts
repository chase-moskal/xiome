
import * as dbmage from "dbmage"
import Stripe from "stripe"

import {StoreConnectedAuth} from "../policies/types.js"
import {SubscriptionTierRow} from "../database/types/rows/subscription-tier-row.js"
import {SubscriptionPlanRow} from "../database/types/rows/subscription-plan-row.js"
import {deleteTiersWithoutParentPlans} from "./delete-tiers-without-parent-plans.js"
import {deleteTiersAndRolesForMissingStripeProducts} from "./delete-tiers-and-roles-for-missing-stripe-products.js"

export async function performSelfHealingRoutinesForSubscriptionPlans({
		auth, planRows ,tierRows, stripePrices, stripeProducts
	}: {
		auth: StoreConnectedAuth
		planRows: SubscriptionPlanRow[]
		tierRows: SubscriptionTierRow[]
		stripePrices: Stripe.Response<Stripe.Price>[]
		stripeProducts: Stripe.Response<Stripe.Product>[]
	}) {

	await deleteTiersAndRolesForMissingStripeProducts({
		auth, tierRows, stripeProducts
	})

	await deleteTiersWithoutParentPlans({
		auth, planRows, tierRows
	})
}
