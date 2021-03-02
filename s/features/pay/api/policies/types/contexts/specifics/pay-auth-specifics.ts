
import {PayTables} from "../../../../tables/types/pay-tables.js"
import {StripeLiaison} from "../../../../../stripe/types/stripe-liaison.js"
import {AuthTables} from "../../../../../../auth/tables/types/auth-tables.js"

export type PayAuthSpecifics = {
	tables: AuthTables & PayTables
	stripeLiaison: StripeLiaison
}
