
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {StoreServiceOptions} from "../types.js"
import {getRowsForTierId} from "./helpers/get-rows-for-tier-id.js"
import {getStripeId} from "../../stripe/liaison/helpers/get-stripe-id.js"
import {getStripePaymentMethod} from "./helpers/get-stripe-payment-method.js"
import {SubscriptionDetails, SubscriptionStatus} from "../../types/store-concepts.js"
import {stripeClientReferenceId} from "../../stripe/utils/stripe-client-reference-id.js"
import {getCurrentStripeSubscription} from "./helpers/get-current-stripe-subscription.js"
import {determineSubscriptionStatus} from "./helpers/utils/determine-subscription-status.js"
import {updateExistingSubscriptionWithNewTier} from "./helpers/update-existing-subscription-with-new-tier.js"

export const makeSubscriptionShoppingService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(options.storePolicies.storeCustomerPolicy)

.expose(auth => ({

	async fetchMySubscriptionDetails(): Promise<SubscriptionDetails[]> {

		const stripeSubscriptions = await auth.stripeLiaisonAccount
			.subscriptions.list({customer: auth.stripeCustomerId})
		if(stripeSubscriptions) {
			const test = <SubscriptionDetails[]>[]
			for (const stripeSubscription of stripeSubscriptions.data) {
				const [stripePriceId] = stripeSubscription
					.items.data.map(item => getStripeId(item.price))
				const tierRow = await auth.storeDatabase.tables.subscriptions
					.tiers.readOne(dbmage.find({stripePriceId}))
				test.push({
					status: determineSubscriptionStatus(stripeSubscription),
					planId: tierRow.planId.string,
					tierId: tierRow.tierId.string,
				})
			}
			return test
		}
		else return []
	},

	async checkoutSubscriptionTier(tierId: string) {
		const {tierRow} = await getRowsForTierId({tierId, auth})
		const allTiers = await auth.storeDatabase.tables.subscriptions.tiers.read(
			dbmage.find({planId: tierRow.planId})
		)
		const stripeSubscriptions = await auth.stripeLiaisonAccount
			.subscriptions.list({customer: auth.stripeCustomerId})
		const subscriptionDetails = <SubscriptionDetails[]>[]
		if(stripeSubscriptions) {
			for (const stripeSubscription of stripeSubscriptions.data) {
				const [stripePriceId] = stripeSubscription
					.items.data.map(item => getStripeId(item.price))
				const tierRow = await auth.storeDatabase.tables.subscriptions
					.tiers.readOne(dbmage.find({stripePriceId}))
				subscriptionDetails.push({
					status: determineSubscriptionStatus(stripeSubscription),
					planId: tierRow.planId.string,
					tierId: tierRow.tierId.string,
				})
			}
		}
		const subcribedTier = allTiers.find(tier =>
			subscriptionDetails.some(item => item.planId === tier.planId.string)
		)
		if(subcribedTier)
			throw new Error("stripe subscription already exists for this plan, cannot create a new one")


		const session = await auth.stripeLiaisonAccount.checkout.sessions.create({
			customer: auth.stripeCustomerId,
			mode: "subscription",
			line_items: [{
				price: tierRow.stripePriceId,
				quantity: 1,
			}],
			client_reference_id: stripeClientReferenceId.build({
				appId: auth.access.appId,
				userId: auth.access.user.userId,
			}),
			payment_intent_data: {
				setup_future_usage: "on_session"
			},

			// TODO store callback links
			success_url: "",
			cancel_url: "",
		})

		// return the information about the checkout session
		return {
			stripeAccountId: auth.stripeAccountId,
			stripeSessionUrl: session.url,
			stripeSessionId: session.id,
		}
	},

	async createNewSubscriptionForTier(tierId: string) {
		const stripePaymentMethod = await getStripePaymentMethod(auth)
		if (!stripePaymentMethod)
			throw new Error("no payment method found (required)")

		const stripeSubscription = await getCurrentStripeSubscription(auth, tierId)
		if (stripeSubscription)
			throw new Error("a subscription already exists for this user (must not)")

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
		const stripePaymentMethod = await getStripePaymentMethod(auth)
		if (!stripePaymentMethod)
			throw new Error("no payment method found (required)")

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
		const stripeSubscription = await getCurrentStripeSubscription(auth, tierId)
		if (!stripeSubscription)
			throw new Error("cannot find existing stripe subscription")

		await auth.stripeLiaisonAccount
			.subscriptions.update(stripeSubscription.id, {
				cancel_at_period_end: true,
			})
	},

	async uncancelSubscription(tierId: string) {
		const stripeSubscription = await getCurrentStripeSubscription(auth, tierId)
		if (!stripeSubscription)
			throw new Error("cannot find existing stripe subscription")

		await auth.stripeLiaisonAccount
			.subscriptions.update(stripeSubscription.id, {
				cancel_at_period_end: false,
			})
	}
}))
