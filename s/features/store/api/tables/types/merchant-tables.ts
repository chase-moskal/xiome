
import {StripeAccountRow} from "./rows/stripe-account-row.js"
import {DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"

export type MerchantTables = {
	stripeAccounts: DbbyTable<StripeAccountRow>
}
