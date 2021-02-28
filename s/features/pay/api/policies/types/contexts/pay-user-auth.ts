
import {UserAuth} from "../../../../../auth/auth-types.js"
import {PayTables} from "../../../tables/types/pay-tables.js"
import {StripeLiaison} from "../../../../stripe/types/stripe-liaison.js"

export interface PayUserAuth extends UserAuth {
	tables: PayTables
	stripeLiaison: StripeLiaison
}
