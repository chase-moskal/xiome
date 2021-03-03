
import {StripePremiumRow} from "./rows/stripe-premium-row.js"
import {StripeCustomerRow} from "./rows/stripe-customer-row.js"
import {DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"

export type BillingTables = {
	stripePremiums: DbbyTable<StripePremiumRow>
	stripeCustomers: DbbyTable<StripeCustomerRow>
}
