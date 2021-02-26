
import {PayTables} from "../../../types/tables/pay-tables.js"
import {StripeLiaison} from "../../../../stripe/types/stripe-liaison.js"
import {BaseUserAuth} from "../../../../../auth/policies/base/types/contexts/base-user-auth.js"

export interface PayUserAuth extends BaseUserAuth {
	payTables: PayTables
	stripeLiaison: StripeLiaison
}
