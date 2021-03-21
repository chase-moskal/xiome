
import Stripe from "stripe"
import {subscriptionUtilities} from "./subscription-utilities.js"
import {getStripeId} from "../../subscriptions/helpers/get-stripe-id.js"
import {SubscriptionDetails} from "../../subscriptions/types/subscription-details.js"

export const subscriptionHelpers = ({utilities}: {
			utilities: ReturnType<typeof subscriptionUtilities>
		}) => ({

	async gatherSubscriptionDataFromCheckout(session: Stripe.Checkout.Session) {
		const stripeSubscriptionId = getStripeId(session.subscription)
		const {subscription, payment} =
			await utilities.fetchExistingSubscriptionInfo(stripeSubscriptionId)
		const active = utilities.isStatusActive(subscription.status)
		return {subscription, payment, active}
	},

	async forEachStripeProduct(
			subscription: SubscriptionDetails,
			each: (stripeProductId: string) => Promise<void>,
		) {
		return Promise.all(subscription.productIds.map(each))
	},

	async getLocalSubscriptionDetailsByStripeProductId({
			userId, active, stripeProductId, subscription
		}: {
			userId: string
			active: boolean
			stripeProductId: string
			subscription: SubscriptionDetails
		}) {
		const {subscriptionPlan, userHasRole} =
			await utilities.getExistingSubscriptionDetails({
				userId, stripeProductId
			})
		const timeframeEnd = utilities.calculateTimeframeEnd({
			active,
			subscription,
			previousTimeframeEnd: userHasRole?.timeframeEnd ?? 0,
		})
		return {subscriptionPlan, userHasRole, timeframeEnd}
	},
})
