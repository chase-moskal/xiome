
import {Stripe} from "stripe"
import {LiaisonConnectedOptions} from "../../../types/liaison-connected-options.js"
import {SetupSubscriptionMetadata} from "../../types/setup-subscription-metadata.js"

export function stripeLiaisonCheckouts({
		stripe, returningLinks, connection,
	}: LiaisonConnectedOptions) {

	async function checkoutSession({userId, customer, ...params}: {
			userId: string
			customer: string
		} & {mode: Stripe.Checkout.SessionCreateParams["mode"]}
			& Partial<Stripe.Checkout.SessionCreateParams>
		): Promise<Stripe.Checkout.Session> {
		return stripe.checkout.sessions.create({
			customer,
			client_reference_id: userId,
			payment_method_types: ["card"],
			cancel_url: returningLinks.checkouts.cancel,
			success_url: returningLinks.checkouts.success,
			...params,
		}, connection)
	}

	return {

		async purchaseSubscriptions({
				userId, prices, customer,
			}: {
				userId: string
				prices: string[]
				customer: string
			}) {
			return checkoutSession({
				userId,
				customer: customer,
				mode: "subscription",
				line_items: prices.map(id => ({
					price: id,
					quantity: 1,
				})),
			})
		},

		async setupSubscription({
				userId, customer, subscription,
			}: {
				userId: string
				customer: string
				subscription: string
			}) {
			return checkoutSession({
				userId,
				customer: customer,
				mode: "setup",
				setup_intent_data: {
					metadata: <SetupSubscriptionMetadata>{
						flow: "update-subscription",
						customer_id: customer,
						subscription_id: subscription,
					},
				},
			})
		},

		// async setupDefaultPayments({
		// 		userId, stripeCustomerId,
		// 	}: {
		// 		userId: string
		// 		stripeCustomerId: string
		// 	}) {
		// 	return checkoutSession({
		// 		userId,
		// 		stripeCustomerId,
		// 		mode: "setup",
		// 		setup_intent_data: {
		// 			metadata: <SetupDefaultPaymentsMetadata>{
		// 				flow: "update-default-payments",
		// 				customer_id: stripeCustomerId,
		// 			},
		// 		},
		// 	})
		// },
	}
}
