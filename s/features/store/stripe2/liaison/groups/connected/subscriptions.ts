
import {Stripe} from "stripe"
import {LiaisonConnectedOptions} from "../../../types/liaison-connected-options.js"

export function stripeLiaisonSubscriptions({stripe, connection}: LiaisonConnectedOptions) {
	return {

		async fetchSubscription(id: string): Promise<Stripe.Subscription> {
			return stripe.subscriptions.retrieve(id, connection)
		},

		async updatePaymentMethodForSubscription({subscription, paymentMethod}: {
				subscription: string
				paymentMethod: string
			}) {
			await stripe.subscriptions.update(subscription, {
				default_payment_method: paymentMethod,
			}, connection)
		},

		async scheduleSubscriptionCancellation(subscription: string) {
			await stripe.subscriptions.update(subscription, {
				cancel_at_period_end: true
			}, connection)
		},
	}
}
