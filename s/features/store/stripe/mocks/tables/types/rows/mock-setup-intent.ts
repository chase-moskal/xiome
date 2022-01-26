
import {Stripe} from "stripe"
import {FlexibleRow} from "./custom-db/flexible-row.js"

export type MockSetupIntent = FlexibleRow<{
	id: string
	customer: string
	payment_method: string
	metadata: {
		subscription_id: string
	}
} & Partial<Stripe.SetupIntent>>
