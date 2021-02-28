
import {DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"
import {StripeAccountRow} from "./rows/stripe-account-row.js"
import {StripePremiumRow} from "./rows/stripe-premium-row.js"
import {StripeCustomerRow} from "./rows/stripe-customer-row.js"

export type BillingTables = {
	stripeAccounts: DbbyTable<StripeAccountRow>
	stripePremiums: DbbyTable<StripePremiumRow>
	stripeCustomers: DbbyTable<StripeCustomerRow>
}
