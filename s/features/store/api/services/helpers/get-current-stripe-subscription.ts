
import {StoreLinkedAuth} from "../../../types/store-metas-and-auths.js"

export async function getCurrentStripeSubscription(auth: StoreLinkedAuth) {

	const stripeSubscriptions = await auth.stripeLiaisonAccount
		.subscriptions.list({customer: auth.stripeCustomerId})

	if (stripeSubscriptions.data.length > 1)
		throw new Error("error, more than one subscription")

	const [stripeSubscription] = stripeSubscriptions.data ?? []
	return stripeSubscription
}
