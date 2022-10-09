
import {Stripe} from "stripe"
import {StoreCustomerAuth} from "../policies/types.js"
import {getStripeId} from "../stripe/utils/get-stripe-id.js"

export async function getStripeDefaultPaymentMethod(
		{stripeLiaisonAccount, stripeCustomerId}: StoreCustomerAuth
	) {

	const stripeCustomer = <Stripe.Customer>(
		await stripeLiaisonAccount
			.customers
			.retrieve(stripeCustomerId)
	)

	const defaultPaymentMethodId = getStripeId(
		stripeCustomer
			.invoice_settings
			.default_payment_method
	)

	return defaultPaymentMethodId
		&& await stripeLiaisonAccount
			.paymentMethods
			.retrieve(defaultPaymentMethodId)
}
