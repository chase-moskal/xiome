
import * as dbmage from "dbmage"
import {StoreConnectedAuth} from "../policies/types.js"

export async function queryDatabaseAboutSubscriptionPlans(
		auth: StoreConnectedAuth
	) {

	const storeTables = auth.storeDatabase.tables
	const planRows = await storeTables
		.subscriptions
		.plans
		.read({conditions: false})

	const planIds = planRows.map(row => row.planId)

	const tierRows = planIds.length
		? await storeTables
			.subscriptions
			.tiers
			.read(dbmage.findAll(planIds, planId => ({planId})))
		: []

	return {planRows, tierRows}
}
