
import * as dbmage from "dbmage"
import {StoreConnectedAuth} from "../policies/types.js"

export async function getRowsForTierId({
		tierId: tierIdString,
		auth: {storeDatabase},
	}: {
		tierId: string
		auth: StoreConnectedAuth
	}) {

	const tierId = dbmage.Id.fromString(tierIdString)

	const tierRow = await storeDatabase
		.tables
		.subscriptions
		.tiers
		.readOne(dbmage.find({tierId}))

	if (!tierRow)
		throw new Error(`subscription tier not found "${tierId}"`)

	const planRow = await storeDatabase
		.tables
		.subscriptions
		.plans
		.readOne(dbmage.find({planId: tierRow.planId}))

	if (!planRow)
		throw new Error(`subscription not found "${tierRow.planId.toString()}"`)

	return {tierRow, planRow}
}
