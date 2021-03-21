
import {getStripeId} from "./helpers/get-stripe-id.js"
import {toPaymentDetails} from "./helpers/to-payment-details.js"
import {LiaisonOptions} from "../types/liaison-options.js"

export function stripeLiaisonAccounting({stripe}: LiaisonOptions) {
	return {

		async createCustomer() {
			const customer = await stripe.customers.create()
			return {stripeCustomerId: customer.id}
		},

		async updateCustomerDefaultPaymentMethod({
				stripeCustomerId,
				stripePaymentMethodId,
			}: {
				stripeCustomerId: string
				stripePaymentMethodId: string
			}) {
			await stripe.customers.update(stripeCustomerId, {
				invoice_settings: {
					default_payment_method: stripePaymentMethodId,
				},
			})
		},

		async fetchPaymentDetails(stripePaymentMethodId: string) {
			return toPaymentDetails(
				await stripe.paymentMethods.retrieve(stripePaymentMethodId)
			)
		},

		async fetchPaymentDetailsByIntentId(intentId: string) {
			const intent = await stripe.setupIntents.retrieve(intentId)
			return toPaymentDetails(
				await stripe.paymentMethods.retrieve(
					getStripeId(intent.payment_method)
				)
			)
		},

		async fetchPaymentDetailsBySubscriptionId(stripeSubscriptionId: string) {
			const subscription = await stripe.subscriptions
				.retrieve(stripeSubscriptionId)
			const paymentMethodId = getStripeId(subscription.default_payment_method)
			return toPaymentDetails(
				await stripe.paymentMethods.retrieve(paymentMethodId)
			)
		},
	}
}
