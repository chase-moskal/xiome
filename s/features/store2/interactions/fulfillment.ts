
import * as dbmage from "dbmage"

import {StoreDatabase} from "../types/store-schema.js"
import {PermissionsInteractions} from "./interactions-types.js"

export async function fulfillSubscriptionRoles({
		userId,
		priceIds,
		storeDatabase,
		permissionsInteractions,
		timerange,
	}:{
		userId: dbmage.Id
		priceIds: string[]
		storeDatabase: StoreDatabase
		permissionsInteractions: PermissionsInteractions
		timerange: {
			timeframeStart: number
			timeframeEnd: number
		}
	}) {

	const {tierRows} = await getTiersForStripePrices({
		priceIds,
		storeDatabase,
	})

	const roleIds = tierRows.map(tierRow => tierRow.roleId)

	await permissionsInteractions.grantUserRoles({
		...timerange,
		roleIds,
		userId,
	})
}

async function getTiersForStripePrices({
		priceIds,
		storeDatabase,
	}: {
		priceIds: string[]
		storeDatabase: StoreDatabase
	}) {

	if (priceIds.length === 0)
		throw new Error("prices not found in subscription from stripe")

	return {
		tierRows: await storeDatabase
			.tables
			.subscriptions
			.tiers
			.read(dbmage.findAll(priceIds, id => ({stripePriceId: id}))),
	}
}
