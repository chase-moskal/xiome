
import Stripe from "stripe"
import {subscriptionHelpers} from "./subscription-helpers.js"
import {subscriptionUtilities} from "./subscription-utilities.js"
import {find} from "../../../../../../toolbox/dbby/dbby-helpers.js"
import {StripeWebhookOptions} from "../types/stripe-webhook-options.js"
import {getStripeId} from "../../subscriptions/helpers/get-stripe-id.js"
import {SubscriptionDetails} from "../../subscriptions/types/subscription-details.js"

export const subscriptionActions = ({
				helpers, utilities,
				logger, tables, subscriptions,
			}: {
				helpers: ReturnType<typeof subscriptionHelpers>
				utilities: ReturnType<typeof subscriptionUtilities>
			} & StripeWebhookOptions
		) => ({

	async fulfillSubscription({userId, session}: {
				userId: string
				session: Stripe.Checkout.Session
			}) {
		const {subscription, payment, active} =
			await helpers.gatherSubscriptionDataFromCheckout(session)

		await helpers.forEachStripeProduct(subscription, async stripeProductId => {
			const {subscriptionPlan, timeframeEnd} =
				await helpers.getLocalSubscriptionDetailsByStripeProductId({
					userId,
					active,
					subscription,
					stripeProductId,
				})
			await Promise.all([
				utilities.fulfillLocalSubscription({
					userId,
					active,
					payment,
					subscription,
					subscriptionPlan,
				}),
				utilities.fulfillUserRole({
					userId,
					timeframeEnd,
					roleId: subscriptionPlan.roleId,
				}),
			])
		})
	},

	async updatePaymentDetails({userId, session}: {
				userId: string
				session: Stripe.Checkout.Session
			}) {
		const stripeIntentId = getStripeId(session.setup_intent)
		const stripeCustomerId = getStripeId(session.customer)
		const stripeSubscriptionId = getStripeId(session.subscription)

		const {card, stripePaymentMethodId} =
			await subscriptions.fetchPaymentDetailsByIntentId(stripeIntentId)

		await subscriptions.updateCustomerDefaultPaymentMethod({
			stripeCustomerId,
			stripePaymentMethodId,
		})

		await subscriptions.updateSubscriptionPaymentMethod({
			stripeSubscriptionId,
			stripePaymentMethodId,
		})

		await tables.billing.subscriptions.update({
			...find({userId, stripeSubscriptionId}),
			write: {...card},
		})
	},

	async respectSubscriptionChange({stripeCustomerId, subscription}: {
			stripeCustomerId: string
			subscription: SubscriptionDetails
		}) {
		const {userId} =
			await tables.billing.customers
				.one(find({stripeCustomerId}))

		const active = utilities.isStatusActive(subscription.status)

		await tables.billing.subscriptions.update({
			...find({stripeSubscriptionId: subscription.id}),
			write: {active},
		})

		await helpers.forEachStripeProduct(subscription, async stripeProductId => {
			const {userHasRole, timeframeEnd} =
				await helpers.getLocalSubscriptionDetailsByStripeProductId({
					userId,
					active,
					subscription,
					stripeProductId,
				})
			if (active) {
				await tables.permissions.userHasRole.update({
					...find({userId, roleId: userHasRole.roleId}),
					write: {timeframeEnd},
				})
			}
		})
	},
})
