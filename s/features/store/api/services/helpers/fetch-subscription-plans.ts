
import {StoreLinkedAuth} from "../../../types/store-metas-and-auths.js"
import {helpersForListingSubscriptions} from "./helpers-for-listing-subscriptions.js"

export async function fetchSubscriptionPlans(auth: StoreLinkedAuth) {
	const helpers = helpersForListingSubscriptions(auth)

	const planRows = await helpers.fetchOurSubscriptionPlanRecords()
	const planCross = await helpers.crossReferencePlansWithStripeProducts(planRows)
	await helpers.deletePlans(planCross.missingIds)

	const tierRows = await helpers.fetchOurRecordsOfPlanTiers(planCross.presentIds)
	const tierCross = await helpers.crossReferenceTiersWithStripePrices(tierRows)

	const parentlessTierIds = helpers.identifyTiersWithoutParentPlan(
		tierRows,
		planCross.presentIds
	)

	const tiersIdsToDelete = helpers.dedupeIds([
		...tierCross.missingIds,
		...parentlessTierIds,
	])

	await helpers.deleteTiers(tiersIdsToDelete)

	return helpers.assembleSubscriptionPlans({
		plans: {rows: planRows, cross: planCross},
		tiers: {rows: tierRows, cross: tierCross},
	})
}
