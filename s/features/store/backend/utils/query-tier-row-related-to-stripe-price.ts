
import Stripe from "stripe"
import * as dbmage from "dbmage"

import {StoreDatabase} from "../database/types/schema.js"
import {getStripeId} from "../stripe/utils/get-stripe-id.js"

export async function queryTierRowRelatedToStripePrice(
		storeDatabase: StoreDatabase,
		price: Stripe.Price,
	) {

	return storeDatabase
		.tables
		.subscriptions
		.tiers
		.readOne(dbmage.find({
			stripeProductId: getStripeId(price.product)
		}))
}
