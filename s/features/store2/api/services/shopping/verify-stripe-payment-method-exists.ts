import {StoreCustomerAuth} from "../../types.js"
import {getStripeDefaultPaymentMethod} from "../helpers/get-stripe-default-payment-method.js"

export async function verifyStripePaymentMethodExists(
	auth: StoreCustomerAuth
) {
	const stripePaymentMethod = await getStripeDefaultPaymentMethod(auth)
	if (!stripePaymentMethod)
		throw new Error("no payment method found (required)")

	return stripePaymentMethod
}
