
import * as dbmage from "dbmage"

import {getTiersForStripePrices} from "./get-tiers-for-stripe-prices.js"
import {StoreDatabase, SubscriptionTierRow} from "../../../types/store-schema.js"

export async function fetchRoleIdsRelatedToSubscribedStripePriceIds(
		storeDatabase: StoreDatabase,
		stripePriceIds: string[],
	) {

	const subscribedTiers = await getTiersForStripePrices({
		priceIds: stripePriceIds,
		storeDatabase,
	})

	const {planId} = subscribedTiers[0]

	const allTiersBelongingToPlan = await storeDatabase
		.tables
		.subscriptions
		.tiers
		.read(dbmage.find({planId}))

	function keepTierIfUserIsNotSubscribed(tier: SubscriptionTierRow) {
		return !subscribedTiers.some(row => row.tierId.string === tier.tierId.string)
	}

	const unsubscribedTiers = allTiersBelongingToPlan
		.filter(keepTierIfUserIsNotSubscribed)

	return {
		subscribedRoleIds: subscribedTiers.map(tier => tier.roleId),
		unsubscribedRoleIds: unsubscribedTiers.map(tier => tier.roleId),
	}
}
