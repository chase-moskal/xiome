
import {Stripe} from "stripe"

export interface MockStripeRecentDetails {
	subscriptionCreation: {
		subscription: Stripe.Subscription
		paymentIntent: Stripe.PaymentIntent
	}
}
