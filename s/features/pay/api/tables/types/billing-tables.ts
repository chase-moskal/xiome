
import {StripeSubscriptionRow} from "./rows/stripe-subscription-row.js"
import {StripeCustomerRow} from "./rows/stripe-customer-row.js"
import {DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"

export type BillingTables = {
	stripePremiums: DbbyTable<StripeSubscriptionRow>
	stripeCustomers: DbbyTable<StripeCustomerRow>
}
