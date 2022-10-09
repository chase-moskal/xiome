
import {Stripe} from "stripe"
import {StoreLinkedAuth} from "../policies/types.js"

export async function updateExistingSubscriptionWithNewTier({
		stripePriceId, auth, stripeSubscription,
	}: {
		stripePriceId: string
		auth: StoreLinkedAuth
		stripeSubscription: Stripe.Subscription
	}): Promise<Stripe.Subscription> {

	const {stripeLiaisonAccount} = auth
	const previousItemId = stripeSubscription.items.data[0].id

	const newItems = [
		{
			id: previousItemId,
			price: stripePriceId,
			quantity: 1,
		}
	]

	return stripeLiaisonAccount.subscriptions.update(stripeSubscription.id, {
		items: newItems,
		cancel_at_period_end: false,
		proration_behavior: "create_prorations",
	})
}
