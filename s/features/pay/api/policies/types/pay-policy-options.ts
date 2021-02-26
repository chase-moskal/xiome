
import {PayTables} from "../../types/tables/pay-tables.js"
import {BasePolicyOptions} from "../../../../auth/policies/base/types/base-policy-options.js"
import {MakeStripeLiaison} from "../../../stripe/types/make-stripe-liaison.js"

export interface PayPolicyOptions extends BasePolicyOptions {
	rawPayTables: PayTables
	makeStripeLiaison: MakeStripeLiaison
}
