
import * as dbmage from "dbmage"

import {StoreDatabase} from "../database/types/schema.js"
import {StripeLiaisonAccount} from "../stripe/liaison/types.js"
import {getStripeId} from "../stripe/utils/get-stripe-id.js"

export async function getTierRowByQueryingStripePriceId({
		stripePriceId,
		storeDatabase,
		stripeLiaisonAccount,
	}: {
		stripePriceId: string
		storeDatabase: StoreDatabase
		stripeLiaisonAccount: StripeLiaisonAccount
	}) {

	const stripePrice = await stripeLiaisonAccount
		.prices
		.retrieve(stripePriceId)

	const stripeProductId = getStripeId(stripePrice.product)

	const tierRow = await storeDatabase
		.tables
		.subscriptions
		.tiers
		.readOne(dbmage.find({stripeProductId}))

	return tierRow
}
