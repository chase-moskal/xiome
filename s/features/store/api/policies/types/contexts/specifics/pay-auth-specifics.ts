
import {PayTables} from "../../../../tables/types/store-tables.js"
import {StripeLiaison} from "../../../../../stripe/types/stripe-liaison.js"
import {AuthTables} from "../../../../../../auth/tables/types/auth-tables.js"

export type StoreAuthSpecifics = {
	tables: PayTables & AuthTables
	stripeLiaison: StripeLiaison
}
