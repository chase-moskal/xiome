
import {Stripe} from "stripe"
import {FlexibleRow} from "./custom-db/flexible-row.js"

export type MockSubscriptionItem = FlexibleRow<{} & Partial<Stripe.SubscriptionItem>>

export type MockSubscription = FlexibleRow<{
	id: string
	items: MockSubscriptionItem[]
	current_period_end: number
	cancel_at_period_end: boolean
	default_payment_method: string
	status: Stripe.Subscription.Status
} & Partial<Stripe.Subscription>>
