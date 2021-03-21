
import {Stripe} from "stripe"

export type SetupDefaultPaymentsMetadata = {
	flow: "update-default-payments"
	customer_id: string
} & Stripe.Metadata
