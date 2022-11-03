
import Stripe from "stripe"
import * as dbmage from "dbmage"

import {StoreConnectedAuth} from "../policies/types.js"
import {getStripeId} from "../stripe/utils/get-stripe-id.js"
import {SubscriptionTierRow} from "../database/types/rows/subscription-tier-row.js"

export async function deleteTiersAndRolesForMissingStripeProducts({
		auth, tierRows, stripeProducts
	}:{
		auth: StoreConnectedAuth
		tierRows: SubscriptionTierRow[]
		stripeProducts: Stripe.Response<Stripe.Product>[]
	}) {

	const {storeDatabase, roleManager} = auth
	const storeTables = storeDatabase.tables
	const stripeProductIds = stripeProducts.map(product => getStripeId(product.id))
	const idsForMissingTiers = tierRows
		.filter(row => !stripeProductIds.includes(row.stripeProductId))
		.map(row => ({roleId: row.roleId, tierId: row.tierId}))

	if (idsForMissingTiers.length) {
		await storeTables
			.subscriptions
			.tiers
			.delete(dbmage.findAll(
				idsForMissingTiers,
				({tierId}) => ({tierId})
			))
		await Promise.all(
			idsForMissingTiers.map(async({roleId}) => {
				await roleManager.deleteRoleAndAllRelatedRecords(roleId)
			})
		)
	}
}
