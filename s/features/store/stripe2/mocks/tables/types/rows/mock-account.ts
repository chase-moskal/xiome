
import {Stripe} from "stripe"
import {FlexibleDbbyRow} from "./dbby-bespoke/flexible-dbby-row.js"

export type MockAccount = {
	id: string
	email: string
	charges_enabled: boolean
	payouts_enabled: boolean
	details_submitted: boolean
} & Partial<Stripe.Account> & FlexibleDbbyRow
