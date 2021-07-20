
import {Rando} from "../../../../toolbox/get-rando.js"
import {StoreTables} from "../tables/types/store-tables.js"
import {AuthTables} from "../../../auth2/types/auth-tables.js"
import {StripeComplex} from "../../stripe2/types/stripe-complex.js"
import {ShoppingOptions} from "../../topics/types/shopping-options.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {StripeConnectOptions} from "../../topics/types/stripe-connect-options.js"
import {prepareAuthPolicies} from "../../../auth2/policies/prepare-auth-policies.js"
import {UnconstrainedTables} from "../../../../framework/api/types/table-namespacing-for-apps.js"

export interface StoreApiOptions {
	rando: Rando
	config: SecretConfig
	stripeComplex: StripeComplex
	authTables: UnconstrainedTables<AuthTables>
	storeTables: UnconstrainedTables<StoreTables>
	shoppingOptions: ShoppingOptions
	stripeConnectOptions: StripeConnectOptions
	authPolicies: ReturnType<typeof prepareAuthPolicies>
}
