
import Stripe from "stripe"
import {biggest} from "./tools/biggest.js"
import {concurrent} from "../../../../../../toolbox/concurrent.js"
import {find} from "../../../../../../toolbox/dbby/dbby-helpers.js"
import {StripeWebhookOptions} from "../types/stripe-webhook-options.js"
import {PaymentDetails} from "../../subscriptions/types/payment-details.js"
import {SubscriptionDetails} from "../../subscriptions/types/subscription-details.js"
import {SubscriptionPlanRow} from "../../../../api/tables/types/rows/subscription-plan-row.js"

export const subscriptionUtilities = ({logger, tables, subscriptions}: StripeWebhookOptions) => ({

	async fetchExistingSubscriptionInfo(stripeSubscriptionId: string) {
		return concurrent({
			subscription: subscriptions.fetchSubscriptionDetails(stripeSubscriptionId),
			payment: subscriptions.fetchPaymentDetailsBySubscriptionId(stripeSubscriptionId),
		})
	},

	isStatusActive(status: Stripe.Subscription.Status) {
		return false
			|| status === "active"
			|| status === "trialing"
			|| status === "past_due"
	},

	async getExistingSubscriptionDetails({userId, stripeProductId}: {
				userId: string
				stripeProductId: string
			}) {

		const subscriptionPlan =
			await tables.billing.subscriptionPlans
				.one(find({userId, stripeProductId}))

		const userHasRole =
			await tables.permissions.userHasRole
				.one(find({userId, roleId: subscriptionPlan.roleId}))

		return {subscriptionPlan, userHasRole}
	},

	calculateTimeframeEnd({
				active, previousTimeframeEnd, subscription,
			}: {
				active: boolean
				previousTimeframeEnd: number
				subscription: SubscriptionDetails
			}) {

		const currentPeriodEnd = active
			? subscription.current_period_end
			: previousTimeframeEnd

		return previousTimeframeEnd === undefined
			? undefined
			: biggest(previousTimeframeEnd, currentPeriodEnd)
	},

	async fulfillLocalSubscription({userId, active, subscription, subscriptionPlan, payment}: {
			userId: string
			active: boolean
			payment: PaymentDetails
			subscription: SubscriptionDetails
			subscriptionPlan: SubscriptionPlanRow
		}) {
		const stripeSubscriptionId = subscription.id
		const {subscriptionPlanId} = subscriptionPlan

		const existingSubscription =
			await tables.billing.subscriptions
				.one(find({userId, subscriptionPlanId}))

		if (existingSubscription) {
			const {stripeSubscriptionId} = existingSubscription
			await tables.billing.subscriptions.update({
				...find({userId, stripeSubscriptionId}),
				write: {
					...payment.card,
					userId,
					active,
					subscriptionPlanId,
					stripeSubscriptionId,
					renewalTime: subscription.current_period_end,
				},
			})
		}
		else {
			await tables.billing.subscriptions.create({
				...payment.card,
				userId,
				active,
				subscriptionPlanId,
				stripeSubscriptionId,
				renewalTime: subscription.current_period_end,
			})
		}
	},

	async fulfillUserRole({userId, roleId, timeframeEnd}: {
			userId: string
			roleId: string
			timeframeEnd: number
		}) {
		await tables.permissions.userHasRole.update({
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
	},
})
