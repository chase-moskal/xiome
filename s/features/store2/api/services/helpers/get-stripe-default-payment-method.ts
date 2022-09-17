
import {Stripe} from "stripe"
import {StoreCustomerAuth} from "../../types.js"
import {getStripeId} from "../../../stripe/liaison/helpers/get-stripe-id.js"

export async function getStripeDefaultPaymentMethod(auth: StoreCustomerAuth) {

	const stripeCustomer = <Stripe.Customer>await auth
		.stripeLiaisonAccount
		.customers
		.retrieve(auth.stripeCustomerId)

	const {default_payment_method} = stripeCustomer.invoice_settings
	const defaultPaymentMethodId = getStripeId(default_payment_method)

	return defaultPaymentMethodId
		&& await auth
			.stripeLiaisonAccount
			.paymentMethods
			.retrieve(getStripeId(default_payment_method))
}
