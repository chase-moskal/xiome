
import * as dbmage from "dbmage"

import {StripeLiaisonAccount} from "../../liaison/types.js"
import {StoreDatabase} from "../../../database/types/schema.js"
import {getStripeId} from "../../utils/get-stripe-id.js"

export async function getTiersForStripePrices({
		priceIds,
		storeDatabase,
		stripeLiaisonAccount,
	}: {
		priceIds: string[]
		storeDatabase: StoreDatabase
		stripeLiaisonAccount: StripeLiaisonAccount
	}) {

	if (priceIds.length === 0)
		throw new Error("prices not found in subscription from stripe")

	const prices = await Promise.all(
		priceIds.map(async priceId => (
			stripeLiaisonAccount
				.prices
				.retrieve(priceId)
		))
	)

	const productIds = prices.map(p => getStripeId(p.product))

	return storeDatabase
		.tables
		.subscriptions
		.tiers
		.read(dbmage.findAll(productIds, id => ({stripeProductId: id})))
}
