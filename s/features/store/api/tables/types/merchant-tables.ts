
import {MerchantRow} from "./rows/merchant-row.js"
import {DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"

export type MerchantTables = {
	stripeAccounts: DbbyTable<MerchantRow>
}
