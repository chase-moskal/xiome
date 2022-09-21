
import * as dbmage from "dbmage"
import {StoreDatabase} from "../../../types/store-schema.js"

export async function getPlanRow({
		planId,
		storeDatabase,
	}: {
		planId: dbmage.Id
		storeDatabase: StoreDatabase
	}) {

	const planRow = await storeDatabase
		.tables
		.subscriptions
		.plans
		.readOne(dbmage.find({planId}))

	if (!planRow)
		throw new Error(`subscription plan not found "${planId.toString()}"`)

	return planRow
}
