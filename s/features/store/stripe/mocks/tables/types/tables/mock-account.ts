
import {Stripe} from "stripe"
import {DbbyRow} from "../../../../../../../toolbox/dbby/dbby-types.js"

export type MockAccount = DbbyRow & Partial<Stripe.Account> & {
	id: string
	email: string
	charges_enabled: boolean
	payouts_enabled: boolean
	details_submitted: boolean
}
