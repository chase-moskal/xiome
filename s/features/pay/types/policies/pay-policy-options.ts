
import {BakePayTables} from "../tables/bake-pay-tables.js"
import {BasePolicyOptions} from "../../../auth/policies/base/types/base-policy-options.js"

export interface PayPolicyOptions extends BasePolicyOptions {
	bakePayTables: BakePayTables
}
