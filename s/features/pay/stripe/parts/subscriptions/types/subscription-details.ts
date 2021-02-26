
import {Stripe} from "stripe"

export interface SubscriptionDetails {
	status: Stripe.Subscription.Status
	current_period_end: number
}
