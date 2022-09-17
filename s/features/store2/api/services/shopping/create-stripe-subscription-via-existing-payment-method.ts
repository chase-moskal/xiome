import Stripe from "stripe"
import {StoreCustomerAuth} from "../../types.js"
import {getRowsForTierId} from "../helpers/get-rows-for-tier-id.js"

export async function createStripeSubscriptionViaExistingPaymentMethod(
		auth: StoreCustomerAuth,
		tierId: string,
		stripePaymentMethod: Stripe.PaymentMethod
	) {

	const {tierRow} = await getRowsForTierId({tierId, auth})
	return auth.stripeLiaisonAccount.subscriptions.create({
		customer: auth.stripeCustomerId,
		default_payment_method: stripePaymentMethod.id,
		items: [{
			price: tierRow.stripePriceId,
			quantity: 1,
		}],
	})
}
