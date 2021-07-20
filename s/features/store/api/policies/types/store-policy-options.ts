
import {StoreTables} from "../../tables/types/store-tables.js"
import {AuthTables} from "../../../../auth2/types/auth-tables.js"
import {StripeComplex} from "../../../stripe2/types/stripe-complex.js"
import {prepareAuthPolicies} from "../../../../auth2/policies/prepare-auth-policies.js"
import {UnconstrainedTables} from "../../../../../framework/api/types/table-namespacing-for-apps.js"

export interface StorePolicyOptions {
	stripeComplex: StripeComplex
	authTables: UnconstrainedTables<AuthTables>
	storeTables: UnconstrainedTables<StoreTables>
	authPolicies: ReturnType<typeof prepareAuthPolicies>
}
