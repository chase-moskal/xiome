
import {Stripe} from "stripe"
import {stripeWebhooks} from "./webhooks/stripe-webhooks.js"

export type StripeWebhooks = ReturnType<typeof stripeWebhooks>

export interface MockStripeRecentDetails {
	subscriptionCreation: {
		subscription: Stripe.Subscription
		paymentIntent: Stripe.PaymentIntent
	}
}

export type DispatchWebhook = <xObject extends {}>(
	type: keyof StripeWebhooks,
	stripeAccountId: string,
	object: xObject,
) => Promise<void>
