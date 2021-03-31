
import {CustomerRow} from "./rows/customer-row.js"
import {StoreInfoRow} from "./rows/store-info-row.js"
import {SubscriptionRow} from "./rows/subscription-row.js"
import {DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"
import {SubscriptionPlanRow} from "./rows/subscription-plan-row.js"

export type BillingTables = {
	customers: DbbyTable<CustomerRow>
	storeInfo: DbbyTable<StoreInfoRow>
	subscriptions: DbbyTable<SubscriptionRow>
	subscriptionPlans: DbbyTable<SubscriptionPlanRow>
}
