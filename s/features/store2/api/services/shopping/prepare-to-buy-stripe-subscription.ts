
import {Stripe} from "stripe"
import * as dbmage from "dbmage"

import {concurrent} from "../../../../../toolbox/concurrent.js"
import {makeStripePopupSpec} from "../../../popups/make-stripe-popup-spec.js"
import {fulfillSubscriptionRoles} from "../../../stripe/fulfillment/fulfillment.js"
import {CheckoutPopupDetails, StoreCustomerAuth, StoreServiceOptions} from "../../types.js"
import {getStripeDefaultPaymentMethod} from "../helpers/get-stripe-default-payment-method.js"
import {getPriceIdsFromSubscription} from "../../../stripe/webhooks/helpers/webhook-helpers.js"
import {createSubscriptionViaCheckoutSession} from "./create-subscription-via-checkout-session.js"
import {timerangeFromStripePeriod} from "../../../stripe/utils/seconds-to-millisecond-timerange.js"
import {getTierRowByQueryingStripePriceId} from "../helpers/get-tier-row-by-querying-stripe-price-id.js"
import {findStripeSubscriptionRelatedToTier} from "../helpers/find-stripe-subscription-related-to-tier.js"
import {updateExistingSubscriptionWithNewTier} from "../helpers/update-existing-subscription-with-new-tier.js"
import {createStripeSubscriptionViaExistingPaymentMethod} from "./create-stripe-subscription-via-existing-payment-method.js"

export async function prepareToBuyStripeSubscription(
		options: StoreServiceOptions,
		auth: StoreCustomerAuth,
		stripePriceId: string,
	) {

	type BuyResult = Promise<{checkoutDetails?: CheckoutPopupDetails}>
	const userId = dbmage.Id.fromString(auth.access.user.userId)

	const actions = {

		async updateAndFulfillSubscription(
				subscription: Stripe.Subscription
			): BuyResult {

			const updatedSubscription = await updateExistingSubscriptionWithNewTier({
				auth,
				stripePriceId,
				stripeSubscription: subscription,
			})

			if (updatedSubscription.status === "active")
				await fulfillSubscriptionRoles({
					userId,
					storeDatabase: auth.storeDatabase,
					stripeLiaisonAccount: auth.stripeLiaisonAccount,
					permissionsInteractions: auth.permissionsInteractions,
					priceIds: getPriceIdsFromSubscription(updatedSubscription),
					timerange: timerangeFromStripePeriod({
						start: updatedSubscription.current_period_start,
						end: updatedSubscription.current_period_end,
					})
				})

			return {}
		},

		async createNewSubscriptionUsingExistingPaymentMethod(
				paymentMethod: Stripe.PaymentMethod
			): BuyResult {

			const newSubscription =
				await createStripeSubscriptionViaExistingPaymentMethod(
					auth,
					stripePriceId,
					paymentMethod,
				)

			if (newSubscription.status === "active")
				await fulfillSubscriptionRoles({
					userId,
					storeDatabase: auth.storeDatabase,
					stripeLiaisonAccount: auth.stripeLiaisonAccount,
					permissionsInteractions: auth.permissionsInteractions,
					priceIds: getPriceIdsFromSubscription(newSubscription),
					timerange: timerangeFromStripePeriod({
						start: newSubscription.current_period_start,
						end: newSubscription.current_period_end,
					})
				})

			return {}
		},

		async createCheckoutPopupToBuyNewSubscription(): BuyResult {
			const {popupId, ...urls} = makeStripePopupSpec.checkout(options)

			const session = await createSubscriptionViaCheckoutSession(
				auth,
				stripePriceId,
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

	const {tierId} = await getTierRowByQueryingStripePriceId({
		...auth,
		stripePriceId,
	})

	return {
		actions,
		...await concurrent({
			defaultPaymentMethod: getStripeDefaultPaymentMethod(auth),
			subscription: findStripeSubscriptionRelatedToTier(auth, tierId.string),
		}),
	}
}
