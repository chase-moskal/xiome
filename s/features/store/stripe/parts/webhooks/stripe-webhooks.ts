
import {Stripe} from "stripe"

import {biggest} from "./utils/biggest.js"
import {concurrent} from "../../../../../toolbox/concurrent.js"
import {find} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {Logger} from "../../../../../toolbox/logger/interfaces.js"
import {StripeWebhookError} from "./errors/stripe-webhook-error.js"
import {getStripeId} from "../subscriptions/helpers/get-stripe-id.js"
import {StoreTables} from "../../../api/tables/types/store-tables.js"
import {SetupMetadata} from "../subscriptions/types/setup-metadata.js"
import {AuthTables} from "../../../../auth/tables/types/auth-tables.js"
import {StripeSubscriptions} from "../subscriptions/types/stripe-subscriptions.js"
import {SubscriptionDetails} from "../subscriptions/types/subscription-details.js"
import {PaymentDetails} from "../subscriptions/types/payment-details.js"

const err = (message: string) => new StripeWebhookError(message)

export function stripeWebhooks({
			logger,
			tables,
			subscriptions,
		}: {
			logger: Logger
			tables: StoreTables & AuthTables
			subscriptions: StripeSubscriptions
		}) {

	// async function evaluatePremium({
	// 		userId,
	// 		subscriptionEnd,
	// 		subscriptionStatus,
	// 		stripeSubscriptionId,
	// 	}: {
	// 		userId: string
	// 		subscriptionEnd: number
	// 		stripeSubscriptionId: string
	// 		subscriptionStatus: Stripe.Subscription.Status
	// 	}) {

	// 	const {timeframeEnd: previousTimeframeEnd}
	// 		= await payDatalayer.getUserHasPremiumRole(userId)

	// 	const active = false
	// 		|| subscriptionStatus === "active"
	// 		|| subscriptionStatus === "trialing"
	// 		|| subscriptionStatus === "past_due"

	// 	const timeframeEnd = previousTimeframeEnd === undefined
	// 		? undefined
	// 		: biggest(previousTimeframeEnd, subscriptionEnd)

	// 	return {active, timeframeEnd}
	// }

	async function evaluatePremium2({userId, payment, subscription}: {
				userId: string
				payment: PaymentDetails
				subscription: SubscriptionDetails
			}) {
		const {status} = subscription
		const active = false
			|| status === "active"
			|| status === "trialing"
			|| status === "past_due"
		await Promise.all(
			subscription.productIds.map(async stripeProductId => {

				// payData: get subscription plan
				const {subscriptionPlanId, roleId} = (
					await tables.billing.subscriptionPlans
						.one(find({stripeProductId}))
				)

				// payData: get user role
				const userHasRole = await tables.permissions.userHasRole
					.one(find({userId, roleId}))
				const previousTimeframeEnd = userHasRole?.timeframeEnd

				const currentPeriodEnd = active
					? subscription.current_period_end
					: previousTimeframeEnd

				// calculate new timeframe end
				const timeframeEnd = previousTimeframeEnd === undefined
					? undefined
					: biggest(previousTimeframeEnd, currentPeriodEnd)

				return {roleId, timeframeEnd}

				await Promise.all([

					// upsert the subscription
					tables.billing.subscriptions.update({
						...find({userId, stripeSubscriptionId: subscription.id}),
						upsert: {
							...payment.card,
							userId,
							subscriptionPlanId,
							renewalTime: timeframeEnd,
							stripeSubscriptionId: subscription.id,
						},
					}),

					// upsert the user role
					tables.permissions.userHasRole.update({
						...find({userId, roleId}),
						upsert: {
							roleId,
							userId,
							hard: true,
							public: true,
							timeframeEnd,
							timeframeStart: undefined,
						},
					})
				])
			})
		)
	}

	//

	async function fulfillSubscription({userId, session}: {
			userId: string
			session: Stripe.Checkout.Session
		}) {

		const stripeSubscriptionId = getStripeId(session.subscription)
		const {subscription, payment} = await concurrent({
			subscription: subscriptions.fetchSubscriptionDetails(stripeSubscriptionId),
			payment: subscriptions.fetchPaymentDetailsBySubscriptionId(stripeSubscriptionId),
		})

		const status = subscription.status
		const active = false
			|| status === "active"
			|| status === "trialing"
			|| status === "past_due"

		
	}

	async function updateSubscription({userId, session}: {
			userId: string
			session: Stripe.Checkout.Session
		}) {
		throw new Error("TODO implement")
		// const {stripeSubscriptionId} = await payDatalayer.getStripePremiumRow(userId)
		// const stripeIntentId = getStripeId(session.setup_intent)
		// const {card, stripePaymentMethodId} = await subscriptions.fetchPaymentDetailsByIntentId(stripeIntentId)
		// await subscriptions.updateSubscriptionPaymentMethod({
		// 	stripePaymentMethodId,
		// 	stripeSubscriptionId,
		// })
		// await payDatalayer.upsertStripePremiumRow({
		// 	...card,
		// 	userId,
		// 	stripeSubscriptionId,
		// })
	}

	async function respectSubscriptionChange({stripeCustomerId, subscription}: {
			stripeCustomerId: string
			subscription: Stripe.Subscription
		}) {
		throw new Error("TODO implement")
		const {userId} = await payDatalayer.getStripeCustomerById(stripeCustomerId)
		const {active, timeframeEnd} = await evaluatePremium({
			userId,
			subscriptionStatus: subscription.status,
			subscriptionEnd: subscription.current_period_end,
		})
		await payDatalayer.grantPremiumRoleUntil(userId, timeframeEnd)
		if (!active) await payDatalayer.deleteStripePremiumRow(userId)
	}

	//
	// stripe webhook responders
	//

	return {

		async ["checkout.session.completed"](event: Stripe.Event) {
			const session = <Stripe.Checkout.Session>event.data.object
			const userId = session.client_reference_id

			// checkout session has purchased a subscription
			if (session.mode === "subscription") {
				logger.info(" - checkout in 'subscription' mode")
				await fulfillSubscription({userId, session})
			}

			// checkout session is in setup mode, no purchase is made
			else if (session.mode === "setup") {
				logger.info(" - checkout in 'setup' mode")
				const metadata = <SetupMetadata>session.metadata
				if (metadata.flow === "UpdatePremiumSubscription") {
					logger.info(` - flow "${metadata.flow}"`)
					await updateSubscription({userId, session})
				}
				else throw err(`unknown flow "${metadata.flow}"`)
			}

			// throw error on unsupported modes
			else throw err(`unknown session mode "${session.mode}"`)
		},

		async ["customer.subscription.updated"](event: Stripe.Event) {
			const subscription = <Stripe.Subscription>event.data.object
			const stripeCustomerId = getStripeId(subscription.customer)
			await respectSubscriptionChange({stripeCustomerId, subscription})
		},
	}
}
