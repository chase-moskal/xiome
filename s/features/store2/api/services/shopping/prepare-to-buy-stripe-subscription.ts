
import {Stripe} from "stripe"
import * as dbmage from "dbmage"

import {concurrent} from "../../../../../toolbox/concurrent.js"
import {makeStripePopupSpec} from "../../../popups/make-stripe-popup-spec.js"
import {CheckoutPopupDetails, StoreCustomerAuth, StoreServiceOptions} from "../../types.js"
import {getStripeDefaultPaymentMethod} from "../helpers/get-stripe-default-payment-method.js"
import {createSubscriptionViaCheckoutSession} from "./create-subscription-via-checkout-session.js"
import {findSubscriptionforPlanRelatingToTier} from "../helpers/get-current-stripe-subscription.js"
import {updateExistingSubscriptionWithNewTier} from "../helpers/update-existing-subscription-with-new-tier.js"
import {fulfillSubscriptionRoles, getPriceIdsFromSubscription} from "../../../stripe/webhooks/helpers/webhook-helpers.js"
import {createStripeSubscriptionViaExistingPaymentMethod} from "./create-stripe-subscription-via-existing-payment-method.js"

export async function prepareToBuyStripeSubscription(
		options: StoreServiceOptions,
		auth: StoreCustomerAuth,
		tierId: string,
	) {

	type BuyResult = Promise<{checkoutDetails?: CheckoutPopupDetails}>

	const actions = {

		async updateAndFulfillSubscription(
				subscription: Stripe.Subscription
			): BuyResult {

			await updateExistingSubscriptionWithNewTier({
				auth,
				tierId,
				stripeSubscription: subscription,
			})

			const updatedSubscription = await auth
				.stripeLiaisonAccount
				.subscriptions
				.retrieve(subscription.id)

			if (updatedSubscription.status === "active")
				await fulfillSubscriptionRoles({
					storeDatabase: auth.storeDatabase,
					permissionsInteractions: auth.permissionsInteractions,
					userId: dbmage.Id.fromString(auth.access.user.userId),
					priceIds: getPriceIdsFromSubscription(updatedSubscription),
					periodInEpochSeconds: {
						start: updatedSubscription.current_period_start,
						end: updatedSubscription.current_period_end,
					},
				})

			return {}
		},

		async createNewSubscriptionUsingExistingPaymentMethod(
				paymentMethod: Stripe.PaymentMethod
			): BuyResult {

			const newSubscription =
				await createStripeSubscriptionViaExistingPaymentMethod(
					auth,
					tierId,
					paymentMethod,
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

			return {}
		},

		async createCheckoutPopupToBuyNewSubscription(): BuyResult {
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
		},
	}

	return {
		actions,
		...await concurrent({
			paymentMethod: getStripeDefaultPaymentMethod(auth),
			subscription: findSubscriptionforPlanRelatingToTier(auth, tierId),
		}),
	}
}
