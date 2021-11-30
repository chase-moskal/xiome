
import {Stripe} from "stripe"
import {FlexibleDbbyRow} from "./dbby-bespoke/flexible-dbby-row.js"

export type MockSetupIntent = {
	id: string
	customer: string
	payment_method: string
	metadata: {
		subscription_id: string
	}
} & Partial<Stripe.SetupIntent> & FlexibleDbbyRow
