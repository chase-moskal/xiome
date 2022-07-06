
import * as dbmage from "dbmage"

import {StoreCustomerAuth} from "../../types.js"
import {SubscriptionDetails} from "../../../types/store-concepts.js"
import {getStripeId} from "../../../stripe/liaison/helpers/get-stripe-id.js"
import {determineSubscriptionStatus} from "../helpers/utils/determine-subscription-status.js"

export async function fetchAllSubscriptionDetails(
		auth: StoreCustomerAuth
	) {

	const stripeSubscriptions = await auth.stripeLiaisonAccount
		.subscriptions.list({customer: auth.stripeCustomerId})

	if(stripeSubscriptions) {
		const subscriptionDetails = <SubscriptionDetails[]>[]
		for (const subscription of stripeSubscriptions.data) {
			const [stripePriceId] = subscription
				.items.data.map(item => getStripeId(item.price))
			const tierRow = await auth.storeDatabase.tables.subscriptions
				.tiers.readOne(dbmage.find({stripePriceId}))
			subscriptionDetails.push({
				status: determineSubscriptionStatus(subscription),
				planId: tierRow.planId.string,
				tierId: tierRow.tierId.string,
			})
		}
		return subscriptionDetails
	}
	else return []
}
