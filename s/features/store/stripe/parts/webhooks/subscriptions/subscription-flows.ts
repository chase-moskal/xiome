
import Stripe from "stripe"
import {SetupMetadata} from "../../subscriptions/types/setup-metadata.js"
import {err} from "../errors/err-webhook.js"
import {StripeWebhookOptions} from "../types/stripe-webhook-options.js"
import {subscriptionActions} from "./subscription-actions.js"

export const subscriptionFlows = ({
			actions,
			logger,
		}: {
			actions: ReturnType<typeof subscriptionActions>
		} & StripeWebhookOptions) => ({

	async purchaseSubscription({userId, session}: {
				userId: string
				session: Stripe.Checkout.Session
			}) {
		logger.info(" - checkout in 'subscription' mode")
		await actions.fulfillSubscription({userId, session})
	},

	async updateSubscriptionPaymentDetails({userId, session}: {
				userId: string
				session: Stripe.Checkout.Session
			}) {
		logger.info(" - checkout in 'setup' mode")
		const metadata = <SetupMetadata>session.metadata
		if (metadata.flow === "UpdatePremiumSubscription") {
			logger.info(` - flow "${metadata.flow}"`)
			await actions.updatePaymentDetails({userId, session})
		}
		else throw err(`unknown flow "${metadata.flow}"`)
	},
})
