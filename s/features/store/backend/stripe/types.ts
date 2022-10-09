
import {Stripe} from "stripe"
import {stripeWebhooks} from "./webhooks/stripe-webhooks.js"
import {prepareMockStripeOperations} from "./utils/prepare-mock-stripe-operations.js"

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

export type MockStripeOperations = ReturnType<typeof prepareMockStripeOperations>
