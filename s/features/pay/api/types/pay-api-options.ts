
import {PayTables} from "./tables/pay-tables.js"
import {VerifyToken} from "redcrypto/dist/types.js"
import {Rando} from "../../../../toolbox/get-rando.js"
import {MakeStripeLiaison} from "../../stripe/types/make-stripe-liaison.js"

export interface PayApiOptions {
	rando: Rando
	rawPayTables: PayTables
	verifyToken: VerifyToken
	makeStripeLiaison: MakeStripeLiaison
}
