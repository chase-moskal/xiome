
import {Stripe} from "stripe"
import {DbbyRow} from "../../../../../../../toolbox/dbby/dbby-types.js"

export type MockCustomer = DbbyRow & Partial<Stripe.Customer> & {
	id: string
}
