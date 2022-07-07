
import {find} from "dbmage"
import Stripe from "stripe"
import {StoreCustomerAuth} from "../../types.js"
import {getRowsForTierId} from "./get-rows-for-tier-id.js"
import {getStripeId} from "../../../stripe/liaison/helpers/get-stripe-id.js"

//TODO rename: findSubscriptionforPlanRelatingToTier
export async function getCurrentStripeSubscription(
		auth: StoreCustomerAuth, tierId: string
	) {

	const {tierRow} = await getRowsForTierId({tierId, auth})

	const stripeSubscriptions = await auth.stripeLiaisonAccount
		.subscriptions.list({customer: auth.stripeCustomerId})

	let stripeSubscription = undefined as Stripe.Subscription
	if(stripeSubscriptions) {
		for (const subcription of stripeSubscriptions.data) {
			const [stripePriceId] = subcription
				.items.data.map(item => getStripeId(item.price))
			const subscribedTierRow = await auth.storeDatabase.tables.subscriptions
				.tiers.readOne(find({stripePriceId}))
			if (tierRow.planId.string === subscribedTierRow.planId.string) {
				stripeSubscription = subcription
			}
		}
	}

	return stripeSubscription
}
