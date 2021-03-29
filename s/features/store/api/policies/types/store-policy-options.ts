
import {StoreTables} from "../../tables/types/store-tables.js"
import {AuthTables} from "../../../../auth/tables/types/auth-tables.js"
import {AuthPolicyOptions} from "../../../../auth/policies/types/auth-policy-options.js"
import {StripeComplex} from "../../../stripe2/types/stripe-complex.js"

export interface StorePolicyOptions extends AuthPolicyOptions {
	tables: AuthTables & StoreTables
	stripeComplex: StripeComplex
}
