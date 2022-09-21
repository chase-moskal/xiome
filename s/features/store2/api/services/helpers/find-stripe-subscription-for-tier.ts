
import {find} from "dbmage"
import Stripe from "stripe"

import {StoreCustomerAuth} from "../../types.js"
import {getRowsForTierId} from "./get-rows-for-tier-id.js"
import {getStripeId} from "../../../stripe/liaison/helpers/get-stripe-id.js"

export async function findStripeSubscriptionForTier(
		auth: StoreCustomerAuth,
		tierId: string
	): Promise<undefined | Stripe.Subscription> {

	const {tierRow} = await getRowsForTierId({tierId, auth})

	const stripeSubscriptions = await auth
		.stripeLiaisonAccount
		.subscriptions
		.list({customer: auth.stripeCustomerId})

	if (stripeSubscriptions) {
		for (const subscription of stripeSubscriptions.data) {

			const [stripePriceId] = subscription
				.items
				.data
				.map(item => getStripeId(item.price))

			const subscribedTierRow = await auth
				.storeDatabase
				.tables
				.subscriptions
				.tiers
				.readOne(find({stripePriceId}))

			if (tierRow.planId.string === subscribedTierRow.planId.string) {
				return subscription
			}
		}
	}
}
