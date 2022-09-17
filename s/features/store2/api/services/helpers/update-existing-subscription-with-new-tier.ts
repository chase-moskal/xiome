
import {Stripe} from "stripe"
import {StoreLinkedAuth} from "../../types.js"

import {getRowsForTierId} from "./get-rows-for-tier-id.js"

export async function updateExistingSubscriptionWithNewTier({
		tierId, auth, stripeSubscription,
		// stripePaymentMethod,
	}: {
		tierId: string
		auth: StoreLinkedAuth
		stripeSubscription: Stripe.Subscription
		// stripePaymentMethod: Stripe.PaymentMethod
	}) {

	const {stripeLiaisonAccount} = auth
	const previousItemId = stripeSubscription.items.data[0].id
	const {tierRow} = await getRowsForTierId({tierId, auth})

	const newItems = [
		{
			id: previousItemId,
			price: tierRow.stripePriceId,
			quantity: 1,
		}
	]

	await stripeLiaisonAccount.subscriptions.update(stripeSubscription.id, {
		items: newItems,
		cancel_at_period_end: false,
		proration_behavior: "always_invoice",
		// default_payment_method: stripePaymentMethod.id,
	})
}
