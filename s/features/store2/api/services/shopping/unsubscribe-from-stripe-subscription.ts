import {StoreCustomerAuth} from "../../types.js"
import {getRowsForTierId} from "../helpers/get-rows-for-tier-id.js"

export async function unsubscribeFromStripeSubscription({
		auth, tierId, stripeSubscriptionId
	}: {
		auth: StoreCustomerAuth
		tierId: string
		stripeSubscriptionId: string
	}) {
	const {tierRow} = await getRowsForTierId({tierId, auth})
	const newItems = [
		{
			price: tierRow.stripePriceId,
			quantity: 1,
		}
	]
	await auth.stripeLiaisonAccount
		.subscriptions.update(stripeSubscriptionId, {items: newItems})
}
