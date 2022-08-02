
import * as renraku from "renraku"

import {StoreServiceOptions} from "../types.js"
import {SubscriptionDetails} from "../../types/store-concepts.js"
import {popupCoordinator} from "../../popups/popup-coordinator.js"
import {cancelStripeSubscription} from "./shopping/cancel-stripe-subscription.js"
import {uncancelStripeSubscription} from "./shopping/uncancel-stripe-subscription.js"
import {fetchAllSubscriptionDetails} from "./shopping/fetch-all-subscription-details.js"
import {verifyStripePaymentMethodExists} from "./shopping/verify-stripe-payment-method-exists.js"
import {unsubscribeFromStripeSubscription} from "./shopping/unsubscribe-from-stripe-subscription.js"
import {createSubscriptionViaCheckoutSession} from "./shopping/create-subscription-via-checkout-session.js"
import {updateExistingSubscriptionWithNewTier} from "./helpers/update-existing-subscription-with-new-tier.js"
import {verifyPlanHasExistingStripeSubscription} from "./shopping/verify-plan-has-existing-stripe-subscription.js"
import {verifyPlanHasNoExistingStripeSubscription} from "./shopping/verify-plan-has-no-existing-stripe-subscription.js"
import {createStripeSubscriptionViaExistingPaymentMethod} from "./shopping/create-stripe-subscription-via-existing-payment-method.js"

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
		await verifyPlanHasNoExistingStripeSubscription(auth, tierId)
		const popupInfo = popupCoordinator.makePopupInfoForStripeCheckout(options)
		const session = await createSubscriptionViaCheckoutSession(
			auth,
			tierId,
			popupInfo,
		)
		return {
			stripeAccountId: auth.stripeAccountId,
			stripeSessionUrl: session.url,
			stripeSessionId: session.id,
			popupInfo,
		}
	},

	async buySubscriptionViaExistingPaymentMethod(tierId: string) {
		await verifyStripePaymentMethodExists(auth)
		await verifyPlanHasNoExistingStripeSubscription(auth, tierId)
		await createStripeSubscriptionViaExistingPaymentMethod(auth, tierId)
	},

	async updateSubscriptionTier(tierId: string) {
		const stripePaymentMethod = await verifyStripePaymentMethodExists(auth)
		const stripeSubscription = await verifyPlanHasExistingStripeSubscription(auth, tierId)
		await updateExistingSubscriptionWithNewTier({
			auth,
			tierId,
			stripePaymentMethod,
			stripeSubscription,
		})
	},

	async unsubscribeFromTier(tierId: string) {
		const stripeSubscription = await verifyPlanHasExistingStripeSubscription(auth, tierId)
		await unsubscribeFromStripeSubscription({
			auth,
			tierId,
			stripeSubscriptionId: stripeSubscription.id
		})
	},

	async cancelSubscription(tierId: string) {
		const stripeSubscription = await verifyPlanHasExistingStripeSubscription(auth, tierId)
		await cancelStripeSubscription(auth, stripeSubscription.id)
	},

	async uncancelSubscription(tierId: string) {
		const stripeSubscription = await verifyPlanHasExistingStripeSubscription(auth, tierId)
		await uncancelStripeSubscription(auth, stripeSubscription.id)
	}
}))
