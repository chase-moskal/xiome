
import {Stripe} from "stripe"
import {StoreLinkedAuth} from "../../types.js"

import {getRowsForTierId} from "./get-rows-for-tier-id.js"

export async function updateExistingSubscriptionWithNewTier({
		tierId, auth, stripeSubscription,
	}: {
		tierId: string
		auth: StoreLinkedAuth
		stripeSubscription: Stripe.Subscription
	}): Promise<Stripe.Subscription> {

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

	return stripeLiaisonAccount.subscriptions.update(stripeSubscription.id, {
		items: newItems,
		cancel_at_period_end: false,
		proration_behavior: "create_prorations",
	})
}
