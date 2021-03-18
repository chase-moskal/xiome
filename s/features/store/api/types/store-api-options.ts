
import {VerifyToken} from "redcrypto/dist/types.js"
import {Rando} from "../../../../toolbox/get-rando.js"
import {StoreTables} from "../tables/types/store-tables.js"
import {StripeComplex} from "../../stripe/types/stripe-complex.js"
import {AuthTables} from "../../../auth/tables/types/auth-tables.js"
import {PlatformConfig} from "../../../../assembly/backend/types/platform-config.js"

export interface StoreApiOptions {
	rando: Rando
	config: PlatformConfig
	tables: StoreTables & AuthTables
	stripeComplex: StripeComplex
	verifyToken: VerifyToken
}
