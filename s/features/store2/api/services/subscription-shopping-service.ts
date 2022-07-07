
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {StoreServiceOptions} from "../types.js"
import {SubscriptionDetails} from "../../types/store-concepts.js"
import {getRowsForTierId} from "./helpers/get-rows-for-tier-id.js"
import {createCheckoutSession} from "./shopping/create-checkout-session.js"
import {getStripePaymentMethod} from "./helpers/get-stripe-payment-method.js"
import {fetchAllSubscriptionDetails} from "./shopping/fetch-all-subscription-details.js"
import {getCurrentStripeSubscription} from "./helpers/get-current-stripe-subscription.js"
import {updateExistingSubscriptionWithNewTier} from "./helpers/update-existing-subscription-with-new-tier.js"


//TODO: Implement functions
export const makeSubscriptionShoppingService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(options.storePolicies.storeCustomerPolicy)

.expose(auth => ({

	async fetchMySubscriptionDetails(): Promise<SubscriptionDetails[]> {
		const subscriptionDetails = await fetchAllSubscriptionDetails(auth)
		return subscriptionDetails
	},

	async buySubscriptionViaCheckoutSession(tierId: string) {
		//verifyPlanHasNoExistingStripeSubscription()
		const {tierRow} = await getRowsForTierId({tierId, auth})
		const allTiers = await auth.storeDatabase.tables.subscriptions.tiers.read(
			dbmage.find({planId: tierRow.planId})
		)
		const subscriptionDetails = await fetchAllSubscriptionDetails(auth)
		const planHasExistingSubscription = allTiers.find(tier =>
			subscriptionDetails.some(item => item.planId === tier.planId.string)
		)
		if(planHasExistingSubscription)
			throw new Error("stripe subscription already exists for this plan, cannot create a new one")

		// createSubscriptionViaCheckoutSession
		const session = await createCheckoutSession(auth, tierRow)
		return {
			stripeAccountId: auth.stripeAccountId,
			stripeSessionUrl: session.url,
			stripeSessionId: session.id,
		}
	},

	async buySubscriptionViaExistingPaymentMethod(tierId: string) {
		//verifyStripePaymentMethodExists()
		const stripePaymentMethod = await getStripePaymentMethod(auth)
		if (!stripePaymentMethod)
			throw new Error("no payment method found (required)")

		
		//verifyPlanHasNoExistingStripeSubscription()
		const stripeSubscription = await getCurrentStripeSubscription(auth, tierId)
		if (stripeSubscription)
			throw new Error("a subscription already exists for this user (must not)")

		// createStripeSubscriptionForPlanRelatingToTier()
		const {tierRow} = await getRowsForTierId({tierId, auth})
		await auth.stripeLiaisonAccount.subscriptions.create({
			customer: auth.stripeCustomerId,
			items: [{
				price: tierRow.stripePriceId,
				quantity: 1,
			}],
		})
	},

	async updateSubscriptionTier(tierId: string) {
		// verifyStripePaymentMethodExists
		const stripePaymentMethod = await getStripePaymentMethod(auth)
		if (!stripePaymentMethod)
			throw new Error("no payment method found (required)")

		// verifyPlanHasExistingStripeSubscription
		const stripeSubscription = await getCurrentStripeSubscription(auth, tierId)
		if (!stripeSubscription)
			throw new Error("user must already have a subscription")

		await updateExistingSubscriptionWithNewTier({
			auth,
			tierId,
			stripePaymentMethod,
			stripeSubscription,
		})
	},

	async unsubscribeFromTier(tierId: string) {
		// verifyPlanHasExistingStripeSubscription()
		// unsubscribeFromStripeSubscription()
		const stripeSubscription = await getCurrentStripeSubscription(auth, tierId)
		const {tierRow} = await getRowsForTierId({tierId, auth})
		const newItems = [
			{
				price: tierRow.stripePriceId,
				quantity: 1,
			}
		]
		await auth.stripeLiaisonAccount
			.subscriptions.update(stripeSubscription.id, {items: newItems})
	},

	async cancelSubscription(tierId: string) {
		// verifyPlanHasExistingStripeSubscription()
		const stripeSubscription = await getCurrentStripeSubscription(auth, tierId)
		if (!stripeSubscription)
			throw new Error("cannot find existing stripe subscription")

		// cancelStripeSubscription()
		await auth.stripeLiaisonAccount
			.subscriptions.update(stripeSubscription.id, {
				cancel_at_period_end: true,
			})
	},

	async uncancelSubscription(tierId: string) {
		// verifyNoStripeSubscriptionExistForPlan()
		const stripeSubscription = await getCurrentStripeSubscription(auth, tierId)
		if (!stripeSubscription)
			throw new Error("cannot find existing stripe subscription")

		// uncancelStripeSubscription
		await auth.stripeLiaisonAccount
			.subscriptions.update(stripeSubscription.id, {
				cancel_at_period_end: false,
			})
	}
}))
