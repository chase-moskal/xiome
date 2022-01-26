
import {Stripe} from "stripe"
import {FlexibleRow} from "./custom-db/flexible-row.js"

export type MockCustomer = FlexibleRow<{
	id: string
} & Partial<Stripe.Customer>>
