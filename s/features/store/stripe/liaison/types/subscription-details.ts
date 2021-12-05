
import {Stripe} from "stripe"

export interface SubscriptionDetails {
	id: string
	status: Stripe.Subscription.Status
	current_period_end: number
	productIds: string[]
}
