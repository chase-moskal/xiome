
import {Stripe} from "stripe"

export type SetupSubscriptionMetadata = {
	flow: "update-subscription"
	customer_id: string
	subscription_id: string
} & Stripe.Metadata
