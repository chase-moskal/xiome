
import {Stripe} from "stripe"

import {biggest} from "./subscriptions/tools/biggest.js"
import {concurrent} from "../../../../../toolbox/concurrent.js"
import {find} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {Logger} from "../../../../../toolbox/logger/interfaces.js"
import {StripeWebhookError} from "./errors/stripe-webhook-error.js"
import {getStripeId} from "../subscriptions/helpers/get-stripe-id.js"
import {StoreTables} from "../../../api/tables/types/store-tables.js"
import {SetupMetadata} from "../subscriptions/types/setup-metadata.js"
import {AuthTables} from "../../../../auth/tables/types/auth-tables.js"
import {StripeSubscriptions} from "../subscriptions/types/stripe-subscriptions.js"
import {SubscriptionDetails} from "../subscriptions/types/subscription-details.js"
import {PaymentDetails} from "../subscriptions/types/payment-details.js"
import {SubscriptionPlanRow} from "../../../api/tables/types/rows/subscription-plan-row.js"
import {StripeWebhookOptions} from "./types/stripe-webhook-options.js"
import {subscriptionUtilities} from "./subscriptions/subscription-utilities.js"
import {subscriptionHelpers} from "./subscriptions/subscription-helpers.js"

const err = (message: string) => new StripeWebhookError(message)

export function stripeWebhooks(options: StripeWebhookOptions) {
	const utilities = subscriptionUtilities(options)
	const helpers = subscriptionHelpers({utilities})
	const actions = {

		async fulfillSubscription2({userId, session}: {
					userId: string
					session: Stripe.Checkout.Session
				}) {

			const {subscription, payment, active} =
				await helpers.gatherSubscriptionDataFromCheckout(session)

			await helpers.forEachStripeProduct(subscription, async stripeProductId => {
				const {subscriptionPlan, userHasRole} =
					await utilities.getExistingSubscriptionDetails({
						userId, stripeProductId
					})
				const timeframeEnd = utilities.calculateTimeframeEnd({
					active,
					subscription,
					previousTimeframeEnd: userHasRole?.timeframeEnd,
				})
				await Promise.all([
					utilities.fulfillLocalSubscription({
						userId,
						active,
						payment,
						subscription,
						subscriptionPlan,
					}),
					utilities.fulfillUserRole({
						userId,
						timeframeEnd,
						roleId: subscriptionPlan.roleId,
					}),
				])
			})
		},

		async updateSubscription2({userId, session}) {
			// fetch stripe setup intent
			// set customer's default payment method with intent
			// set subscription's default payment method
		},

		async respectSubscriptionChange2({stripeCustomerId, stripeSubscription}) {
			// fetch merchant record
			// evaluate new subscription timeframe end
			// if active:
			//  - fetch planid to get role
			//  - update user role timeframe
			// else not active:
			//  - update subscription to not active
		},
	}



	//
	// stripe webhook responders
	//

	return {

		async ["checkout.session.completed"](event: Stripe.Event) {
			const session = <Stripe.Checkout.Session>event.data.object
			const userId = session.client_reference_id

			// checkout session has purchased a subscription
			if (session.mode === "subscription") {
				logger.info(" - checkout in 'subscription' mode")
				await fulfillSubscription({userId, session})
			}

			// checkout session is in setup mode, no purchase is made
			else if (session.mode === "setup") {
				logger.info(" - checkout in 'setup' mode")
				const metadata = <SetupMetadata>session.metadata
				if (metadata.flow === "UpdatePremiumSubscription") {
					logger.info(` - flow "${metadata.flow}"`)
					await updateSubscription({userId, session})
				}
				else throw err(`unknown flow "${metadata.flow}"`)
			}

			// throw error on unsupported modes
			else throw err(`unknown session mode "${session.mode}"`)
		},

		async ["customer.subscription.updated"](event: Stripe.Event) {
			const subscription = <Stripe.Subscription>event.data.object
			const stripeCustomerId = getStripeId(subscription.customer)
			await respectSubscriptionChange({stripeCustomerId, subscription})
		},
	}
}
