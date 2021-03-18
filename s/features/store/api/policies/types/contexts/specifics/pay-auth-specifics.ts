
import {StoreTables} from "../../../../tables/types/store-tables.js"
import {StripeLiaison} from "../../../../../stripe/types/stripe-liaison.js"
import {AuthTables} from "../../../../../../auth/tables/types/auth-tables.js"
import {StripeAccounting} from "../../../../../stripe/parts/accounts/types/stripe-accounting.js"

export type StoreAuthSpecifics = {
	tables: StoreTables & AuthTables
}
