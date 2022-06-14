
import {Stripe} from "stripe"

export type StripeWebhooks = any

export interface MockStripeRecentDetails {
	subscriptionCreation: {
		subscription: Stripe.Subscription
		paymentIntent: Stripe.PaymentIntent
	}
}
