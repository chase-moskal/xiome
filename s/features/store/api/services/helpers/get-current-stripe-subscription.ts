
import {StoreCustomerAuth} from "../../../types/store-metas-and-auths.js"

export async function getCurrentStripeSubscription(auth: StoreCustomerAuth) {

	const stripeSubscriptions = await auth.stripeLiaisonAccount
		.subscriptions.list({customer: auth.stripeCustomerId})

	const x = stripeSubscriptions.data
	console.log(x)
	debugger

	if (stripeSubscriptions.data.length > 1)
		throw new Error("error, more than one subscription")

	const [stripeSubscription] = stripeSubscriptions.data ?? []
	return stripeSubscription
}
