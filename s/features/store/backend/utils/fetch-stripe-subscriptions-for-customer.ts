
import Stripe from "stripe"
import {StoreCustomerAuth} from "../policies/types.js"

export async function fetchStripeSubscriptionsForCustomer(
		auth: StoreCustomerAuth
	): Promise<Stripe.Subscription[]> {

	const stripeSubscriptions = (
		await auth.stripeLiaisonAccount
			.subscriptions
			.list({customer: auth.stripeCustomerId})
	)

	return stripeSubscriptions?.data ?? []
}
