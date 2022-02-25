
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {getRowsForTierId} from "./helpers/get-rows-for-tier-id.js"
import {getStripeId} from "../../stripe/liaison/helpers/get-stripe-id.js"
import {fetchSubscriptionPlans} from "./helpers/fetch-subscription-plans.js"
import {getStripePaymentMethod} from "./helpers/get-stripe-payment-method.js"
import {stripeClientReferenceId} from "../utils/stripe-client-reference-id.js"
import {getCurrentStripeSubscription} from "./helpers/get-current-stripe-subscription.js"
import {updateExistingSubscriptionWithNewTier} from "./helpers/apply-tier-to-existing-subscription.js"
import {StoreServiceOptions, SubscriptionDetails, SubscriptionStatus} from "../../types/store-concepts.js"
import {reconstructStripeSubscriptionItems} from "./helpers/utils/reconstruct-stripe-subscription-items.js"
import {determineSubscriptionStatus} from "./helpers/utils/determine-subscription-status.js"

export const makeSubscriptionShoppingService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(options.storeLinkedPolicy)

.expose(auth => ({

	async listSubscriptionPlans() {
		return fetchSubscriptionPlans(auth)
	},

	async fetchMySubscriptionStatus(): Promise<SubscriptionDetails> {
		const stripeSubscriptions = await auth.stripeLiaisonAccount
			.subscriptions.list({customer: auth.stripeCustomerId})
		const [stripeSubscription] = stripeSubscriptions?.data ?? []
		if (stripeSubscription) {
			const stripePriceIds = stripeSubscription
				.items.data.map(item => getStripeId(item.price))
			const tierRows = stripePriceIds.length > 0
				? await auth.database.tables.store.subscriptions
					.tiers.read(
						dbmage.findAll(stripePriceIds, stripePriceId => ({stripePriceId}))
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

		// debugger

		const session = await auth.stripeLiaisonAccount.checkout.sessions.create({
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

	async updateExistingSubscriptionWithNewTier(tierId: string) {
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
}))
