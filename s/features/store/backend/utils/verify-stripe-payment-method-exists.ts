
import {StoreCustomerAuth} from "../policies/types.js"
import {getStripeDefaultPaymentMethod} from "./get-stripe-default-payment-method.js"

export async function verifyStripePaymentMethodExists(
	auth: StoreCustomerAuth
) {
	const stripePaymentMethod = await getStripeDefaultPaymentMethod(auth)
	if (!stripePaymentMethod)
		throw new Error("no payment method found (required)")

	return stripePaymentMethod
}
