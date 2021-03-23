
import {Stripe} from "stripe"
import {DbbyValue} from "../../../../../../../toolbox/dbby/dbby-types.js"

export type MockCustomer = {
	id: string
} & Partial<Stripe.Customer> & {[key: string]: DbbyValue | any}
