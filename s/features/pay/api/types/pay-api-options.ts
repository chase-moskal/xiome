
import {VerifyToken} from "redcrypto/dist/types.js"
import {Rando} from "../../../../toolbox/get-rando.js"
import {PayTables} from "../tables/types/pay-tables.js"
import {PlatformConfig} from "../../../auth/types/PlatformConfig"
import {AuthTables} from "../../../auth/tables/types/auth-tables.js"
import {MakeStripeLiaison} from "../../stripe/types/make-stripe-liaison.js"

export interface PayApiOptions {
	rando: Rando
	config: PlatformConfig
	tables: AuthTables & PayTables
	verifyToken: VerifyToken
	makeStripeLiaison: MakeStripeLiaison
}
