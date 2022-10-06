
import Stripe from "stripe"

import {StoreCustomerAuth} from "../policies/types.js"
import {getRowsForTierId} from "./get-rows-for-tier-id.js"
import {getStripeId} from "../stripe/utils/get-stripe-id.js"
import {getTierRowByQueryingStripePriceId} from "./get-tier-row-by-querying-stripe-price-id.js"

export async function findStripeSubscriptionRelatedToTier(
		auth: StoreCustomerAuth,
		tierId: string
	): Promise<undefined | Stripe.Subscription> {

	const {storeDatabase, stripeLiaisonAccount, stripeCustomerId} = auth
	const {tierRow} = await getRowsForTierId({tierId, auth})

	const stripeSubscriptions = await stripeLiaisonAccount
		.subscriptions
		.list({customer: stripeCustomerId})

	if (stripeSubscriptions) {
		for (const subscription of stripeSubscriptions.data) {
			const stripePriceId = getStripeId(subscription.items.data[0].price)
			const subscribedTierRow = await getTierRowByQueryingStripePriceId({
				stripePriceId,
				storeDatabase,
				stripeLiaisonAccount,
			})
			if (tierRow.planId.string === subscribedTierRow.planId.string)
				return subscription
		}
	}
}
