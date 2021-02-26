
import {Stripe} from "stripe"

import {UserHasRoleRow} from "../../../../auth/auth-types.js"
import {concurrent} from "../../../../../toolbox/concurrent.js"
import {Logger} from "../../../../../toolbox/logger/interfaces.js"
import {getStripeId} from "../subscriptions/helpers/get-stripe-id.js"
import {SetupMetadata} from "../subscriptions/types/setup-metadata.js"
import {StripeSubscriptions} from "../subscriptions/types/stripe-subscriptions.js"
import {StripePremiumRow} from "../../../api/types/tables/rows/stripe-premium-row.js"
import {StripeCustomerRow} from "../../../api/types/tables/rows/stripe-customer-row.js"

export class StripeWebhookError extends Error {
	name = this.constructor.name
}

const err = (message: string) => new StripeWebhookError(message)

function biggest(...args: number[]) {
	let x = 0
	for (const y of args) {
		if (y > x) x = y
	}
	return x
}

export function stripeWebhooks({
		xiome,
		logger,
		stripeSubscriptions,
	}: {
		logger: Logger
		stripeSubscriptions: StripeSubscriptions
		xiome: {
			getUserHasPremiumRole: (userId: string) => Promise<UserHasRoleRow>
			getStripeCustomerByCustomerId: (stripeCustomerId: string) => Promise<StripeCustomerRow>
			upsertStripePremiumRow: (row: StripePremiumRow) => Promise<void>
			deleteStripePremiumRow: (userId: string) => Promise<void>
			getStripePremiumRow: (userId: string) => Promise<StripePremiumRow>
			grantPremiumRoleUntil: (userId: string, timeframeEnd: number) => Promise<void>
		}
	}) {

	async function evaluatePremium({
			userId,
			subscriptionEnd,
			subscriptionStatus,
		}: {
			userId: string
			subscriptionEnd: number
			subscriptionStatus: Stripe.Subscription.Status
		}) {

		const {timeframeEnd: previousTimeframeEnd}
			= await xiome.getUserHasPremiumRole(userId)

		const active = false
			|| subscriptionStatus === "active"
			|| subscriptionStatus === "trialing"
			|| subscriptionStatus === "past_due"

		const timeframeEnd = previousTimeframeEnd === undefined
			? undefined
			: biggest(previousTimeframeEnd, subscriptionEnd)

		return {active, timeframeEnd}
	}

	/**
	 * action to fulfill a purchased subscription
	 */
	async function fulfillSubscription({userId, session}: {
			userId: string
			session: Stripe.Checkout.Session
		}) {
		const stripeSubscriptionId = getStripeId(session.subscription)
		const {subscription, payment} = await concurrent({
			subscription: stripeSubscriptions.fetchSubscriptionDetails(stripeSubscriptionId),
			payment: stripeSubscriptions.fetchPaymentDetailsBySubscriptionId(stripeSubscriptionId),
		})
		const {card} = payment

		const {timeframeEnd} = await evaluatePremium({
			userId,
			subscriptionStatus: subscription.status,
			subscriptionEnd: subscription.current_period_end,
		})

		await Promise.all([
			xiome.upsertStripePremiumRow({
				...card,
				userId,
				stripeSubscriptionId,
			}),
			xiome.grantPremiumRoleUntil(userId, timeframeEnd),
		])
	}

	/**
	 * action to update the payment method used on an active subscription
	 */
	async function updatePremiumSubscription({userId, session}: {
			userId: string
			session: Stripe.Checkout.Session
		}) {
		const {stripeSubscriptionId} = await xiome.getStripePremiumRow(userId)
		const stripeIntentId = getStripeId(session.setup_intent)
		const {card, stripePaymentMethodId} = await stripeSubscriptions.fetchPaymentDetailsByIntentId(stripeIntentId)
		await stripeSubscriptions.updateSubscriptionPaymentMethod({
			stripePaymentMethodId,
			stripeSubscriptionId,
		})
		await xiome.upsertStripePremiumRow({
			...card,
			userId,
			stripeSubscriptionId,
		})
	}

	/**
	 * action to unfulfill or refulfill expiring/canceled/defunct subscriptions
	 */
	async function respectSubscriptionChange({stripeCustomerId, subscription}: {
			stripeCustomerId: string
			subscription: Stripe.Subscription
		}) {
		const {userId} = await xiome.getStripeCustomerByCustomerId(stripeCustomerId)
		const {active, timeframeEnd} = await evaluatePremium({
			userId,
			subscriptionStatus: subscription.status,
			subscriptionEnd: subscription.current_period_end,
		})
		await xiome.grantPremiumRoleUntil(userId, timeframeEnd)
		if (!active) await xiome.deleteStripePremiumRow(userId)
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
					await updatePremiumSubscription({userId, session})
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
