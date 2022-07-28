
import {StoreCustomerAuth} from "../../types.js"
import {getRowsForTierId} from "../helpers/get-rows-for-tier-id.js"
import {popupCoordinator} from "../../../popups/popup-coordinator.js"
import {stripeClientReferenceId} from "../../../stripe/utils/stripe-client-reference-id.js"

export async function createSubscriptionViaCheckoutSession(
		auth: StoreCustomerAuth,
		tierId: string,
		returnUrl = "http://localhost:8080/popups/return"
	) {

	const makeUrl = (success: boolean) => (
		`${returnUrl}?${popupCoordinator.stripeCheckout.encodeQuerystring({
			status: success
				? "success"
				: "cancel"
		})}`
	)

	const {tierRow} = await getRowsForTierId({tierId, auth})
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
		success_url: makeUrl(true),
		cancel_url: makeUrl(false),
	})
	return session
}
