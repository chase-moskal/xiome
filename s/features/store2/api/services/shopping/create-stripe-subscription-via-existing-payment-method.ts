import Stripe from "stripe"
import {StoreCustomerAuth} from "../../types.js"
import {getRowsForTierId} from "../helpers/get-rows-for-tier-id.js"

export async function createStripeSubscriptionViaExistingPaymentMethod(
		auth: StoreCustomerAuth,
		stripePriceId: string,
		stripePaymentMethod: Stripe.PaymentMethod
	) {

	return auth.stripeLiaisonAccount.subscriptions.create({
		customer: auth.stripeCustomerId,
		default_payment_method: stripePaymentMethod.id,
		items: [{
			price: stripePriceId,
			quantity: 1,
		}],
	})
}
