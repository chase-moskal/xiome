
import Stripe from "stripe"
import {getStripeId} from "../stripe/utils/get-stripe-id.js"
import {StripeLiaisonAccount} from "../stripe/liaison/types.js"

export async function queryStripePriceRelatedToSubscription(
		stripeLiaisonAccount: StripeLiaisonAccount,
		subscription: Stripe.Subscription,
	) {

	const [stripePriceId] = subscription
		.items
		.data
		.map(item => getStripeId(item.price))

	const price = await stripeLiaisonAccount
		.prices
		.retrieve(stripePriceId)

	return price
}
