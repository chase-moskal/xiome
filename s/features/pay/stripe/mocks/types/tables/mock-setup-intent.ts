
import Stripe from "stripe"
import {DbbyRow} from "../../../../../../toolbox/dbby/dbby-types.js"

export type MockSetupIntent = DbbyRow & Partial<Stripe.SetupIntent> & {
	id: string
	customer: string
	payment_method: string
	metadata: {
		subscription_id: string
	}
}
