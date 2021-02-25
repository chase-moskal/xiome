
import {PayTables} from "./tables/pay-tables.js"
import {VerifyToken} from "redcrypto/dist/types.js"
import {Rando} from "../../../../toolbox/get-rando.js"
import {StripeLiaison} from "../../stripe/types/stripe-liaison.js"

export interface PayApiOptions {
	rando: Rando
	rawPayTables: PayTables
	stripeLiaison: StripeLiaison
	verifyToken: VerifyToken
}
