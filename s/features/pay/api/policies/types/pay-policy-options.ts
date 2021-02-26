
import {PayTables} from "../../types/tables/pay-tables.js"
import {PermissionsTables} from "../../../../auth/auth-types.js"
import {MakeStripeLiaison} from "../../../stripe/types/make-stripe-liaison.js"
import {BasePolicyOptions} from "../../../../auth/policies/base/types/base-policy-options.js"

export interface PayPolicyOptions extends BasePolicyOptions {
	rawPayTables: PayTables
	rawPermissionsTables: PermissionsTables
	makeStripeLiaison: MakeStripeLiaison
}
