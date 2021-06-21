
import {Rando} from "../../../../toolbox/get-rando.js"
import {StoreTables} from "../tables/types/store-tables.js"
import {StripeComplex} from "../../stripe2/types/stripe-complex.js"
import {AuthTables} from "../../../auth/tables/types/auth-tables.js"
import {ShoppingOptions} from "../../topics/types/shopping-options.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {StripeConnectOptions} from "../../topics/types/stripe-connect-options.js"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"

export interface StoreApiOptions {
	rando: Rando
	config: SecretConfig
	stripeComplex: StripeComplex
	tables: StoreTables & AuthTables
	shoppingOptions: ShoppingOptions
	stripeConnectOptions: StripeConnectOptions
	authPolicies: ReturnType<typeof prepareAuthPolicies>
}
