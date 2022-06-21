
import {Stripe} from "stripe"
import {getStripeId} from "../../../stripe/liaison/helpers/get-stripe-id.js"
import {StoreCustomerAuth} from "../../types.js"

export async function getStripePaymentMethod(auth: StoreCustomerAuth) {

	const stripeCustomer = <Stripe.Customer>await auth.stripeLiaisonAccount
		.customers.retrieve(auth.stripeCustomerId)

	const stripePaymentMethod = await auth.stripeLiaisonAccount.paymentMethods
		.retrieve(
			getStripeId(stripeCustomer.invoice_settings.default_payment_method)
		)

	return stripePaymentMethod.id
		? stripePaymentMethod
		: undefined
}
