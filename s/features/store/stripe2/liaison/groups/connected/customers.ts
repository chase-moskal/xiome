
import {getStripeId} from "../../helpers/get-stripe-id.js"
import {toPaymentDetails} from "../../helpers/to-payment-details.js"
import {LiaisonConnectedOptions} from "../../../types/liaison-connected-options.js"

export function stripeLiaisonCustomers({stripe, connection}: LiaisonConnectedOptions) {
	return {

		async createCustomer() {
			const customer = await stripe.customers.create(connection)
			return {stripeCustomerId: customer.id}
		},

		async updateDefaultPaymentMethod({
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
			}, connection)
		},

		async fetchPaymentDetails(stripePaymentMethodId: string) {
			return toPaymentDetails(
				await stripe.paymentMethods.retrieve(stripePaymentMethodId, connection)
			)
		},

		async fetchPaymentDetailsByIntentId(intentId: string) {
			const intent = await stripe.setupIntents.retrieve(intentId, connection)
			return toPaymentDetails(
				await stripe.paymentMethods.retrieve(
					getStripeId(intent.payment_method)
				)
			)
		},

		async fetchPaymentDetailsBySubscriptionId(stripeSubscriptionId: string) {
			const subscription =
				await stripe.subscriptions.retrieve(stripeSubscriptionId, connection)
			const paymentMethodId = getStripeId(subscription.default_payment_method)
			return toPaymentDetails(
				await stripe.paymentMethods.retrieve(paymentMethodId, connection)
			)
		},
	}
}
