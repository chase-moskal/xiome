
import {CustomerRow} from "./rows/stripe-customer-row.js"
import {SubscriptionRow} from "./rows/stripe-subscription-row.js"
import {DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"
import {SubscriptionPlanRow} from "./rows/subscription-plan-row.js"

export type BillingTables = {
	customers: DbbyTable<CustomerRow>
	subscriptions: DbbyTable<SubscriptionRow>
	subscriptionPlans: DbbyTable<SubscriptionPlanRow>
}
