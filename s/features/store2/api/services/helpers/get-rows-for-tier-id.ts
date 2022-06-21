
import * as dbmage from "dbmage"
import {StoreLinkedAuth} from "../../types.js"


export async function getRowsForTierId({tierId, auth}: {
		tierId: string
		auth: StoreLinkedAuth
	}) {

	const tierRow = await auth.storeDatabase.tables.subscriptions
		.tiers.readOne(dbmage.find({tierId: dbmage.Id.fromString(tierId)}))

	if (!tierRow)
		throw new Error(`subscription tier not found "${tierId}"`)

	const planRow = await auth.storeDatabase.tables.subscriptions
		.plans.readOne(dbmage.find({planId: tierRow.planId}))

	if (!planRow)
		throw new Error(`subscription not found "${tierRow.planId.toString()}"`)

	return {tierRow, planRow}
}
