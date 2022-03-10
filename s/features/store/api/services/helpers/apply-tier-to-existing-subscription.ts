
import {Stripe} from "stripe"

import {getRowsForTierId} from "./get-rows-for-tier-id.js"
import {StoreLinkedAuth} from "../../../types/store-metas-and-auths.js"
import {reconstructStripeSubscriptionItems} from "./utils/reconstruct-stripe-subscription-items.js"

export async function updateExistingSubscriptionWithNewTier({
		tierId, auth, stripePaymentMethod, stripeSubscription,
	}: {
		tierId: string
		auth: StoreLinkedAuth
		stripePaymentMethod: Stripe.PaymentMethod
		stripeSubscription: Stripe.Subscription
	}) {

	const {tierRow, planRow} = await getRowsForTierId({tierId, auth})

	const newItems = await reconstructStripeSubscriptionItems({
		auth,
		tierRow,
		planRow,
		stripeSubscription,
	})

	await auth.stripeLiaisonAccount.subscriptions.update(stripeSubscription.id, {
		items: newItems,
		cancel_at_period_end: false,
		default_payment_method: stripePaymentMethod.id,
	})
}
