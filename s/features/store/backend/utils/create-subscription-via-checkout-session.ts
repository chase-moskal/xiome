
import {StoreCustomerAuth} from "../policies/types.js"
import {stripeClientReferenceId} from "../stripe/utils/stripe-client-reference-id.js"

export async function createSubscriptionViaCheckoutSession(
		auth: StoreCustomerAuth,
		stripePriceId: string,
		{success_url, cancel_url}: {success_url: string, cancel_url: string},
	) {

	return auth.stripeLiaisonAccount.checkout.sessions.create({
		customer: auth.stripeCustomerId,
		mode: "subscription",
		line_items: [{
			price: stripePriceId,
			quantity: 1,
		}],
		client_reference_id: stripeClientReferenceId.build({
			appId: auth.access.appId,
			userId: auth.access.user.userId,
		}),
		success_url,
		cancel_url,
	})
}
