
import {Stripe} from "stripe"

import {err} from "./errors/err-webhook.js"
import {getStripeId} from "../subscriptions/helpers/get-stripe-id.js"
import {StripeWebhookOptions} from "./types/stripe-webhook-options.js"
import {subscriptionUtilities} from "./subscriptions/subscription-utilities.js"
import {subscriptionHelpers} from "./subscriptions/subscription-helpers.js"
import {toSubscriptionDetails} from "../subscriptions/helpers/to-subscription-details.js"
import {subscriptionActions} from "./subscriptions/subscription-actions.js"
import {subscriptionFlows} from "./subscriptions/subscription-flows.js"

export function stripeWebhooks(options: StripeWebhookOptions) {
	const {logger} = options
	const utilities = subscriptionUtilities(options)
	const helpers = subscriptionHelpers({utilities})
	const actions = subscriptionActions({...options, helpers, utilities})
	const flows = subscriptionFlows({...options, actions})

	return {
		async ["checkout.session.completed"](event: Stripe.Event) {
			const session = <Stripe.Checkout.Session>event.data.object
			const userId = session.client_reference_id
			const flow = {userId, session}

			if (session.mode === "subscription")
				await flows.purchaseSubscription(flow)

			else if (session.mode === "setup")
				await flows.updateSubscriptionPaymentDetails(flow)

			else
				throw err(`unknown session mode "${session.mode}"`)
		},

		async ["customer.subscription.updated"](event: Stripe.Event) {
			const stripeSubscription = <Stripe.Subscription>event.data.object
			const subscription = toSubscriptionDetails(stripeSubscription)
			const stripeCustomerId = getStripeId(stripeSubscription.customer)
			logger.info(` - updating subscription ${subscription.id} for stripe customer id ${stripeCustomerId}`)
			await actions.respectSubscriptionChange({stripeCustomerId, subscription})
		},
	}
}
