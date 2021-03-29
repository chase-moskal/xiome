
import {VerifyToken} from "redcrypto/dist/types.js"
import {Rando} from "../../../../toolbox/get-rando.js"
import {StoreTables} from "../tables/types/store-tables.js"
import {StripeComplex} from "../../stripe2/types/stripe-complex.js"
import {AuthTables} from "../../../auth/tables/types/auth-tables.js"
import {ShoppingOptions} from "../../topics/types/shopping-options.js"
import {StripeConnectOptions} from "../../topics/types/stripe-connect-options.js"
import {PlatformConfig} from "../../../../assembly/backend/types/platform-config.js"

export interface StoreApiOptions {
	rando: Rando
	config: PlatformConfig
	stripeComplex: StripeComplex
	tables: StoreTables & AuthTables
	shoppingOptions: ShoppingOptions
	stripeConnectOptions: StripeConnectOptions
	verifyToken: VerifyToken
}
