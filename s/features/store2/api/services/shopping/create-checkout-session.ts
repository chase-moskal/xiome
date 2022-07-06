import {StoreCustomerAuth} from "../../types.js"
import {SubscriptionTierRow} from "../../../types/store-schema.js"
import {stripeClientReferenceId} from "../../../stripe/utils/stripe-client-reference-id.js"

export async function createCheckoutSession(
		auth: StoreCustomerAuth,
		tierRow: SubscriptionTierRow
	) {
	const session = await auth.stripeLiaisonAccount.checkout.sessions.create({
		customer: auth.stripeCustomerId,
		mode: "subscription",
		line_items: [{
			price: tierRow.stripePriceId,
			quantity: 1,
		}],
		client_reference_id: stripeClientReferenceId.build({
			appId: auth.access.appId,
			userId: auth.access.user.userId,
		}),
		payment_intent_data: {
			setup_future_usage: "on_session"
		},

		// TODO store callback links
		success_url: "",
		cancel_url: "",
	})
	return session
}
