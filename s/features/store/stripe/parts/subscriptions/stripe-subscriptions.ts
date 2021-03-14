
import {Stripe} from "stripe"
import {getStripeId} from "./helpers/get-stripe-id.js"
import {toPaymentDetails} from "./helpers/to-payment-details.js"
import {toSubscriptionDetails} from "./helpers/to-subscription-details.js"
import {SetupMetadata} from "./types/setup-metadata.js"
import {UpdateFlow} from "./types/update-flow.js"

export function stripeSubscriptions({stripe}: {
		stripe: Stripe
	}) {

	const commonSessionParams = ({userId, popupUrl, stripeCustomerId}: {
			userId: string
			popupUrl: string
			stripeCustomerId: string
		}): Stripe.Checkout.SessionCreateParams => ({
		customer: stripeCustomerId,
		client_reference_id: userId,
		payment_method_types: ["card"],
		cancel_url: `${popupUrl}#cancel`,
		success_url: `${popupUrl}#success`,
	})

	return {
		async createCustomer() {
			const customer = await stripe.customers.create()
			return {stripeCustomerId: customer.id}
		},

		async checkoutSubscriptionPurchase({
				userId,
				popupUrl,
				stripePlanId,
				stripeCustomerId,
			}: {
				userId: string
				popupUrl: string
				stripePlanId: string
				stripeCustomerId: string
			}) {
			const session = await stripe.checkout.sessions.create({
				...commonSessionParams({userId, popupUrl, stripeCustomerId}),
				mode: "subscription",
				subscription_data: {items: [{
					quantity: 1,
					plan: stripePlanId,
				}]},
			})
			return {stripeSessionId: session.id}
		},

		async checkoutSubscriptionUpdate({
				flow,
				userId,
				popupUrl,
				stripeCustomerId,
				stripeSubscriptionId,
			}: {
				userId: string
				flow: UpdateFlow
				popupUrl: string
				stripeCustomerId: string
				stripeSubscriptionId: string
			}) {
			const session = await stripe.checkout.sessions.create({
				...commonSessionParams({userId, popupUrl, stripeCustomerId}),
				mode: "setup",
				setup_intent_data: {
					metadata: {
						customer_id: stripeCustomerId,
						subscription_id: stripeSubscriptionId,
					}
				},
				metadata: <SetupMetadata>{flow},
			})
			return {stripeSessionId: session.id}
		},

		async updateSubscriptionPaymentMethod({
				stripeSubscriptionId,
				stripePaymentMethodId,
			}: {
				stripeSubscriptionId: string
				stripePaymentMethodId: string
			}) {
			await stripe.subscriptions.update(stripeSubscriptionId, {
				default_payment_method: stripePaymentMethodId
			})
		},

		async scheduleSubscriptionCancellation({stripeSubscriptionId}: {
			stripeSubscriptionId: string
		}) {
			await stripe.subscriptions.update(stripeSubscriptionId, {
				cancel_at_period_end: true
			})
		},

		async fetchSubscriptionDetails(subscriptionId: string) {
			const subscription = await stripe.subscriptions.retrieve(subscriptionId)
			return toSubscriptionDetails(subscription)
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
