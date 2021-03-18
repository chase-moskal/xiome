
import {StoreTables} from "../../tables/types/store-tables.js"
import {StripeComplex} from "../../../stripe/types/stripe-complex.js"
import {AuthTables} from "../../../../auth/tables/types/auth-tables.js"
import {AuthPolicyOptions} from "../../../../auth/policies/types/auth-policy-options.js"

export interface StorePolicyOptions extends AuthPolicyOptions {
	tables: AuthTables & StoreTables
	stripeComplex: StripeComplex
}
