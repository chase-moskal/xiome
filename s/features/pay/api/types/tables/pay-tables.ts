
import {StripeAccountRow} from "./rows/stripe-account-row.js"
import {StripeCustomerRow} from "./rows/stripe-customer-row.js"
import {StripePremiumRow} from "./rows/stripe-premium-row.js"
import {DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"

export type PayTables = {
	stripeAccounts: DbbyTable<StripeAccountRow>
	stripePremiums: DbbyTable<StripePremiumRow>
	stripeCustomers: DbbyTable<StripeCustomerRow>
}
