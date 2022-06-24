
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {getRowsForTierId} from "./helpers/get-rows-for-tier-id.js"
import {getStripeId} from "../../stripe/liaison/helpers/get-stripe-id.js"
import {getStripePaymentMethod} from "./helpers/get-stripe-payment-method.js"
import {getCurrentStripeSubscription} from "./helpers/get-current-stripe-subscription.js"
import {determineSubscriptionStatus} from "./helpers/utils/determine-subscription-status.js"
import {updateExistingSubscriptionWithNewTier} from "./helpers/update-existing-subscription-with-new-tier.js"
import {SubscriptionDetails, SubscriptionStatus} from "../../types/store-concepts.js"
import {reconstructStripeSubscriptionItems} from "./helpers/utils/reconstruct-stripe-subscription-items.js"
import {StoreServiceOptions} from "../types.js"
import {stripeClientReferenceId} from "../../stripe/utils/stripe-client-reference-id.js"

export const makeSubscriptionShoppingService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(options.storePolicies.storeCustomerPolicy)

.expose(auth => ({

	async fetchMySubscriptionDetails(): Promise<SubscriptionDetails> {
		const stripeSubscriptions = await auth.stripeLiaisonAccount
			.subscriptions.list({customer: auth.stripeCustomerId})
		const [stripeSubscription] = stripeSubscriptions?.data ?? []
		if (stripeSubscription) {
			const stripePriceIds = stripeSubscription
				.items.data.map(item => getStripeId(item.price))
			const tierRows = stripePriceIds.length > 0
				? await auth.storeDatabase.tables.subscriptions.tiers.read(
					dbmage.findAll(stripePriceIds, stripePriceId => ({
						stripePriceId: <string>stripePriceId,
					}))
				)
				: []
			return {
				status: determineSubscriptionStatus(stripeSubscription),
				tierIds: tierRows.map(row => row.tierId.string),
			}
		}
		else {
			return {
				status: SubscriptionStatus.Unsubscribed,
				tierIds: [],
			}
		}
	},

	async checkoutSubscriptionTier(tierId: string) {
		const stripeSubscription = await getCurrentStripeSubscription(auth)
		if (stripeSubscription)
			throw new Error("stripe subscription already exists, cannot create a new one")

		const {tierRow} = await getRowsForTierId({tierId, auth})

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

		const stripeSubscription = await getCurrentStripeSubscription(auth)
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

		const stripeSubscription = await getCurrentStripeSubscription(auth)
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
		const stripeSubscription = await getCurrentStripeSubscription(auth)
		const {tierRow, planRow} = await getRowsForTierId({tierId, auth})
		const newItems = await reconstructStripeSubscriptionItems({
			auth,
			tierRow,
			planRow,
			stripeSubscription,
		})
		await auth.stripeLiaisonAccount
			.subscriptions.update(stripeSubscription.id, {items: newItems})
	},

	async cancelSubscription() {
		const stripeSubscription = await getCurrentStripeSubscription(auth)
		if (!stripeSubscription)
			throw new Error("cannot find existing stripe subscription")

		await auth.stripeLiaisonAccount
			.subscriptions.update(stripeSubscription.id, {
				cancel_at_period_end: true,
			})
	},

	async uncancelSubscription() {
		const stripeSubscription = await getCurrentStripeSubscription(auth)
		if (!stripeSubscription)
			throw new Error("cannot find existing stripe subscription")

		await auth.stripeLiaisonAccount
			.subscriptions.update(stripeSubscription.id, {
				cancel_at_period_end: false,
			})
	}
}))
