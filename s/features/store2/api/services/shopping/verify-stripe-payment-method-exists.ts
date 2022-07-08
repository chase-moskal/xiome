import {StoreCustomerAuth} from "../../types.js"
import {getStripePaymentMethod} from "../helpers/get-stripe-payment-method.js"

export async function verifyStripePaymentMethodExists(
	auth: StoreCustomerAuth
) {
	const stripePaymentMethod = await getStripePaymentMethod(auth)
	if (!stripePaymentMethod)
		throw new Error("no payment method found (required)")

	return stripePaymentMethod
}
