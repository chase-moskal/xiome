
import {Stripe} from "stripe"
import {StoreLinkedAuth} from "../../types.js"

import {getRowsForTierId} from "./get-rows-for-tier-id.js"

export async function updateExistingSubscriptionWithNewTier({
		tierId, auth, stripePaymentMethod, stripeSubscription,
	}: {
		tierId: string
		auth: StoreLinkedAuth
		stripePaymentMethod: Stripe.PaymentMethod
		stripeSubscription: Stripe.Subscription
	}) {

	const {tierRow} = await getRowsForTierId({tierId, auth})
	const newItems = [
		{
			price: tierRow.stripePriceId,
			quantity: 1,
		}
	]

	await auth.stripeLiaisonAccount.subscriptions.update(stripeSubscription.id, {
		items: newItems,
		cancel_at_period_end: false,
		default_payment_method: stripePaymentMethod.id,
	})
}
