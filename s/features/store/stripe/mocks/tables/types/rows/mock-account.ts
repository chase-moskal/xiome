
import {Stripe} from "stripe"
import {FlexibleRow} from "./custom-db/flexible-row.js"

export type MockAccount = FlexibleRow<{
	id: string
	email: string
	charges_enabled: boolean
	payouts_enabled: boolean
	details_submitted: boolean
} & Partial<Stripe.Account>>
