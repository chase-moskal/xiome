
import {Stripe} from "stripe"
import {getStripeId} from "../../helpers/get-stripe-id.js"
import {LiaisonConnectedOptions} from "../../../types/liaison-connected-options.js"

export function stripeLiaisonCustomers({stripe, connection}: LiaisonConnectedOptions) {
	return {

		async createCustomer(): Promise<Stripe.Customer> {
			return stripe.customers.create(connection)
		},

		async updateDefaultPaymentMethod({customer, paymentMethod}: {
				customer: string
				paymentMethod: string
			}) {
			await stripe.customers.update(customer, {
				invoice_settings: {
					default_payment_method: paymentMethod,
				},
			}, connection)
		},

		async fetchPaymentMethod(
				paymentMethod: string
			): Promise<Stripe.PaymentMethod> {
			return stripe.paymentMethods.retrieve(paymentMethod, connection)
		},

		async fetchPaymentDetailsByIntentId(
				intentId: string
			): Promise<Stripe.PaymentMethod> {
			const intent = await stripe.setupIntents.retrieve(intentId, connection)
			return stripe.paymentMethods.retrieve(getStripeId(intent.payment_method), connection)
		},

		async fetchPaymentDetailsBySubscriptionId(
				subscriptionId: string
			): Promise<Stripe.PaymentMethod> {
			const subscription =
				await stripe.subscriptions.retrieve(subscriptionId, connection)
			const paymentMethodId =
				getStripeId(subscription.default_payment_method)
			return stripe.paymentMethods.retrieve(paymentMethodId, connection)
		},
	}
}
