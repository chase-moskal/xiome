
import * as dbmage from "dbmage"
import {SubscriptionDetails} from "../../isomorphic/concepts.js"

import {StoreCustomerAuth} from "../policies/types.js"
import {getStripeId} from "../stripe/liaison/helpers/get-stripe-id.js"
import {determineSubscriptionStatus} from "./determine-subscription-status.js"

export async function fetchAllSubscriptionDetails({
		storeDatabase,
		stripeCustomerId,
		stripeLiaisonAccount,
	}: StoreCustomerAuth) {

	const stripeSubscriptions = await stripeLiaisonAccount
		.subscriptions
		.list({customer: stripeCustomerId})

	if (!stripeSubscriptions)
		return []

	return Promise.all(
		stripeSubscriptions.data.map(async subscription => {
			const [stripePriceId] = subscription
				.items
				.data
				.map(item => getStripeId(item.price))

			const price = await stripeLiaisonAccount
				.prices
				.retrieve(stripePriceId)

			const tierRow = await storeDatabase
				.tables
				.subscriptions
				.tiers
				.readOne(dbmage.find({
					stripeProductId: getStripeId(price.product)
				}))

			return <SubscriptionDetails>{
				status: determineSubscriptionStatus(subscription),
				planId: tierRow?.planId.string,
				tierId: tierRow?.tierId.string,
			}
		})
	)
}
