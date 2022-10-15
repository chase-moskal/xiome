
import * as dbmage from "dbmage"
import {StoreDatabase} from "../../../database/types/schema.js"
import {SubscriptionTierRow} from "../../../database/types/rows/subscription-tier-row.js"

import {StripeLiaisonAccount} from "../../liaison/types.js"
import {getTiersForStripePrices} from "./get-tiers-for-stripe-prices.js"

export async function fetchRoleIdsRelatedToSubscribedStripePriceIds({
		storeDatabase,
		stripePriceIds,
		stripeLiaisonAccount,
	}: {
		storeDatabase: StoreDatabase
		stripePriceIds: string[]
		stripeLiaisonAccount: StripeLiaisonAccount
	}) {

	const subscribedTiers = await getTiersForStripePrices({
		priceIds: stripePriceIds,
		storeDatabase,
		stripeLiaisonAccount,
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
