
import {StoreCustomerAuth} from "../policies/types.js"

export async function cancelStripeSubscription(
		auth: StoreCustomerAuth,
		stripeSubscriptionId: string
	) {
	await auth.stripeLiaisonAccount
		.subscriptions.update(stripeSubscriptionId, {
			cancel_at_period_end: true,
		})
}
