
import {StripeLiaison} from "./stripe-liaison.js"
import {StoreTables} from "../../api/tables/types/store-tables.js"
import {AuthTables} from "../../../auth/tables/types/auth-tables.js"
import {StripeAccounting} from "../parts/accounts/types/stripe-accounting.js"

export interface StripeComplex {
	accounting: StripeAccounting
	getLiaison({}: {
		stripeConnectAccountId: string
		tables: StoreTables & AuthTables
	}): StripeLiaison
}
