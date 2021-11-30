
import {Stripe} from "stripe"
import {FlexibleDbbyRow} from "./dbby-bespoke/flexible-dbby-row.js"

export type MockCustomer = {
	id: string
} & Partial<Stripe.Customer> & FlexibleDbbyRow
