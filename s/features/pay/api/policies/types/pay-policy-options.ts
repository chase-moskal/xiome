
import {PayTables} from "../../types/tables/pay-tables.js"
import {BasePolicyOptions} from "../../../../auth/policies/base/types/base-policy-options.js"

export interface PayPolicyOptions extends BasePolicyOptions {
	rawPayTables: PayTables
}
