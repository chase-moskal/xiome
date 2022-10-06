
import {StoreCustomerAuth} from "../policies/types.js"

export async function uncancelStripeSubscription(
		auth: StoreCustomerAuth,
		stripeSubscriptionId: string
	) {
	await auth.stripeLiaisonAccount
		.subscriptions.update(stripeSubscriptionId, {
			cancel_at_period_end: false,
		})
}
