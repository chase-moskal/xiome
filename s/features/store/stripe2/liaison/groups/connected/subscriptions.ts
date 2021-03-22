
import {toSubscriptionDetails} from "../../helpers/to-subscription-details.js"
import {LiaisonConnectedOptions} from "../../../types/liaison-connected-options.js"

export function stripeLiaisonSubscriptions({stripe, connection}: LiaisonConnectedOptions) {
	return {

		async fetchSubscriptionDetails(stripeSubscriptionId: string) {
			const subscription =
				await stripe.subscriptions.retrieve(stripeSubscriptionId, connection)
			return toSubscriptionDetails(subscription)
		},

		async updatePaymentMethodForSubscription({
				stripeSubscriptionId,
				stripePaymentMethodId,
			}: {
				stripeSubscriptionId: string
				stripePaymentMethodId: string
			}) {
			await stripe.subscriptions.update(stripeSubscriptionId, {
				default_payment_method: stripePaymentMethodId,
			}, connection)
		},

		async scheduleSubscriptionCancellation(stripeSubscriptionId: string) {
			await stripe.subscriptions.update(stripeSubscriptionId, {
				cancel_at_period_end: true
			}, connection)
		},
	}
}
