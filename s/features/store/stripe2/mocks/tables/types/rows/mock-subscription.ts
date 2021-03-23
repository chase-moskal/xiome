
import {Stripe} from "stripe"
import {FlexibleDbbyRow} from "./dbby-bespoke/flexible-dbby-row.js"

export type MockSubscriptionItem = {} & Partial<Stripe.SubscriptionItem> & FlexibleDbbyRow

export type MockSubscription = {
	id: string
	items: MockSubscriptionItem[]
	current_period_end: number
	cancel_at_period_end: boolean
	default_payment_method: string
	status: Stripe.Subscription.Status
} & Partial<Stripe.Subscription> & FlexibleDbbyRow
