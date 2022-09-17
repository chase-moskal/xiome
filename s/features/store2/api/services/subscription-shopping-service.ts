
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {SubscriptionDetails} from "../../types/store-concepts.js"
import {CheckoutPopupDetails, StoreServiceOptions} from "../types.js"
import {makeStripePopupSpec} from "../../popups/make-stripe-popup-spec.js"
import {cancelStripeSubscription} from "./shopping/cancel-stripe-subscription.js"
import {uncancelStripeSubscription} from "./shopping/uncancel-stripe-subscription.js"
import {fetchAllSubscriptionDetails} from "./shopping/fetch-all-subscription-details.js"
import {getStripeDefaultPaymentMethod} from "./helpers/get-stripe-default-payment-method.js"
import {verifyStripePaymentMethodExists} from "./shopping/verify-stripe-payment-method-exists.js"
import {findSubscriptionforPlanRelatingToTier} from "./helpers/get-current-stripe-subscription.js"
import {unsubscribeFromStripeSubscription} from "./shopping/unsubscribe-from-stripe-subscription.js"
import {createSubscriptionViaCheckoutSession} from "./shopping/create-subscription-via-checkout-session.js"
import {updateExistingSubscriptionWithNewTier} from "./helpers/update-existing-subscription-with-new-tier.js"
import {verifyPlanHasExistingStripeSubscription} from "./shopping/verify-plan-has-existing-stripe-subscription.js"
import {verifyPlanHasNoExistingStripeSubscription} from "./shopping/verify-plan-has-no-existing-stripe-subscription.js"
import {createStripeSubscriptionViaExistingPaymentMethod} from "./shopping/create-stripe-subscription-via-existing-payment-method.js"
import {fulfillSubscriptionRoles, getPriceIdsFromSubscription, secondsToMilliseconds} from "../../stripe/webhooks/helpers/webhook-helpers.js"

export const makeSubscriptionShoppingService = (
	options: StoreServiceOptions
) => renraku.service()

.policy(options.storePolicies.storeCustomerPolicy)

.expose(auth => ({

	async fetchMySubscriptionDetails(): Promise<SubscriptionDetails[]> {
		const subscriptionDetails = await fetchAllSubscriptionDetails(auth)
		return subscriptionDetails
	},

	async buy(tierId: string): Promise<{checkoutDetails?: CheckoutPopupDetails}> {
		const stripeSubscription = await findSubscriptionforPlanRelatingToTier(auth, tierId)

		if (stripeSubscription) {
			await updateExistingSubscriptionWithNewTier({
				auth,
				tierId,
				stripeSubscription,
			})
			const newSubscription = await auth.stripeLiaisonAccount.subscriptions
				.retrieve(stripeSubscription.id)
			if (newSubscription.status === "active")
				await fulfillSubscriptionRoles({
					userId: dbmage.Id.fromString(auth.access.user.userId),
					periodInEpochSeconds: {
						start: newSubscription.current_period_start,
						end: newSubscription.current_period_end,
					},
					priceIds: getPriceIdsFromSubscription(newSubscription),
					permissionsInteractions: auth.permissionsInteractions,
					storeDatabase: auth.storeDatabase,
				})
		}
		else {
			const stripeDefaultPaymentMethod = await getStripeDefaultPaymentMethod(auth)
			if (stripeDefaultPaymentMethod) {
				const newSubscription = await createStripeSubscriptionViaExistingPaymentMethod(
					auth, tierId, stripeDefaultPaymentMethod
				)
				if (newSubscription.status === "active")
					await fulfillSubscriptionRoles({
						userId: dbmage.Id.fromString(auth.access.user.userId),
						periodInEpochSeconds: {
							start: newSubscription.current_period_start,
							end: newSubscription.current_period_end,
						},
						priceIds: getPriceIdsFromSubscription(newSubscription),
						permissionsInteractions: auth.permissionsInteractions,
						storeDatabase: auth.storeDatabase,
					})
			}
			else {
				const {popupId, ...urls} = makeStripePopupSpec.checkout(options)
				const session = await createSubscriptionViaCheckoutSession(
					auth,
					tierId,
					urls,
				)
				return {
					checkoutDetails: {
						popupId,
						stripeAccountId: auth.stripeAccountId,
						stripeSessionUrl: session.url,
						stripeSessionId: session.id,
					},
				}
			}
		}

		return {}

		// if (stripePaymentMethod) {
		// 	if (stripeSubscription) {
		// 		debugger
		// 		await updateExistingSubscriptionWithNewTier({
		// 			auth,
		// 			tierId,
		// 			stripeSubscription,
		// 		})
		// 		return {}
		// 	}
		// 	else {
		// 		debugger
		// 		await createStripeSubscriptionViaExistingPaymentMethod(auth, tierId, stripePaymentMethod)
		// 		return {}
		// 	}
		// }
		// else {
		// 	debugger
		// 	const {popupId, ...urls} = makeStripePopupSpec.checkout(options)
		// 	const session = await createSubscriptionViaCheckoutSession(
		// 		auth,
		// 		tierId,
		// 		urls,
		// 	)
		// 	return {
		// 		checkoutDetails: {
		// 			popupId,
		// 			stripeAccountId: auth.stripeAccountId,
		// 			stripeSessionUrl: session.url,
		// 			stripeSessionId: session.id,
		// 		},
		// 	}
		// }
	},

	// async buySubscriptionViaCheckoutSession(tierId: string) {
	// 	await verifyPlanHasNoExistingStripeSubscription(auth, tierId)
	// 	const {popupId, ...urls} = makeStripePopupSpec.checkout(options)
	// 	const session = await createSubscriptionViaCheckoutSession(
	// 		auth,
	// 		tierId,
	// 		urls,
	// 	)
	// 	return {
	// 		stripeAccountId: auth.stripeAccountId,
	// 		stripeSessionUrl: session.url,
	// 		stripeSessionId: session.id,
	// 		popupId,
	// 	}
	// },

	// async buySubscriptionViaExistingPaymentMethod(tierId: string) {
	// 	const stripePaymentMethod = await verifyStripePaymentMethodExists(auth)
	// 	await verifyPlanHasNoExistingStripeSubscription(auth, tierId)
	// 	await createStripeSubscriptionViaExistingPaymentMethod(auth, tierId, stripePaymentMethod)
	// },

	// async updateSubscriptionTier(tierId: string) {
	// 	const stripePaymentMethod = await verifyStripePaymentMethodExists(auth)
	// 	const stripeSubscription = await verifyPlanHasExistingStripeSubscription(auth, tierId)
	// 	await updateExistingSubscriptionWithNewTier({
	// 		auth,
	// 		tierId,
	// 		stripePaymentMethod,
	// 		stripeSubscription,
	// 	})
	// },

	// async unsubscribeFromTier(tierId: string) {
	// 	const stripeSubscription = await verifyPlanHasExistingStripeSubscription(auth, tierId)
	// 	await unsubscribeFromStripeSubscription({
	// 		auth,
	// 		tierId,
	// 		stripeSubscriptionId: stripeSubscription.id
	// 	})
	// },

	async cancelSubscription(tierId: string) {
		const stripeSubscription = await verifyPlanHasExistingStripeSubscription(auth, tierId)
		await cancelStripeSubscription(auth, stripeSubscription.id)
	},

	async uncancelSubscription(tierId: string) {
		const stripeSubscription = await verifyPlanHasExistingStripeSubscription(auth, tierId)
		await uncancelStripeSubscription(auth, stripeSubscription.id)
	}
}))
