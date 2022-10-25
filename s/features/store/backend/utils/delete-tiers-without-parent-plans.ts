
import * as dbmage from "dbmage"

import {StoreConnectedAuth} from "../policies/types.js"
import {SubscriptionPlanRow} from "../database/types/rows/subscription-plan-row.js"
import {SubscriptionTierRow} from "../database/types/rows/subscription-tier-row.js"


export async function deleteTiersWithoutParentPlans({
		auth, planRows, tierRows
	}: {
		auth: StoreConnectedAuth
		planRows: SubscriptionPlanRow[]
		tierRows: SubscriptionTierRow[]
	}) {

	const storeTables = auth.storeDatabase.tables
	const planIdStrings = planRows.map(row => row.planId.string)

	const tierIdsWithoutParentPlans = tierRows
		.filter(row => !planIdStrings.includes(row.planId.string))
		.map(row => row.tierId)

	if (tierIdsWithoutParentPlans.length)
		await storeTables
			.subscriptions
			.tiers
			.delete(dbmage.findAll(
				tierIdsWithoutParentPlans,
				tierId => ({tierId})
			))
}
