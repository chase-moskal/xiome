
import * as dbmage from "dbmage"
import {StoreDatabase} from "../../../types/store-schema.js"

export async function getTiersForStripePrices({
		priceIds,
		storeDatabase,
	}: {
		priceIds: string[]
		storeDatabase: StoreDatabase
	}) {

	if (priceIds.length === 0)
		throw new Error("prices not found in subscription from stripe")

	return storeDatabase
		.tables
		.subscriptions
		.tiers
		.read(dbmage.findAll(priceIds, id => ({stripePriceId: id})))
}
