
import {Stripe} from "stripe"
import {DbbyRow} from "../../../../../../../toolbox/dbby/dbby-types.js"

export type MockSubscription = DbbyRow & Partial<Stripe.Subscription> & {
	id: string
	plan: {id: string} & any
	current_period_end: number
	cancel_at_period_end: boolean
	default_payment_method: string
	status: Stripe.Subscription.Status
}
