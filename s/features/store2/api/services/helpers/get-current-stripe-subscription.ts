import {find} from "dbmage"
import Stripe from "stripe"
import {getStripeId} from "../../../stripe/liaison/helpers/get-stripe-id.js"
import {StoreCustomerAuth} from "../../types.js"

//getStripeSubscriptionForTier

export async function getCurrentStripeSubscription(
		auth: StoreCustomerAuth, tierId: string
	) {

	const stripeSubscriptions = await auth.stripeLiaisonAccount
		.subscriptions.list({customer: auth.stripeCustomerId})

	let stripeSubscription = undefined as Stripe.Subscription

	if(stripeSubscriptions){
		for (const sub of stripeSubscriptions.data) {
			const [stripePriceId] = sub
				.items.data.map(item => getStripeId(item.price))
			const tierRow = await auth.storeDatabase.tables.subscriptions
				.tiers.readOne(find({stripePriceId}))
			if (tierRow.tierId.string === tierId) stripeSubscription = sub
		}
	}

	return stripeSubscription
}
