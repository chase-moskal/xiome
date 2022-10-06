
import * as dbmage from "dbmage"

import {CustomerRow} from "./rows/billing-rows.js"
import {MerchantRow} from "./rows/merchant-rows.js"
import {SubscriptionPlanRow, SubscriptionTierRow} from "./rows/subscription-rows.js"
import {SchemaToUnconstrainedTables} from "../../../../../framework/api/types/unconstrained-tables.js"

export type StoreSchema = dbmage.AsSchema<{
	merchants: MerchantRow
	customers: CustomerRow
	subscriptions: {
		plans: SubscriptionPlanRow
		tiers: SubscriptionTierRow
	}
}>

export type StoreDatabase = dbmage.Database<StoreSchema>

export type StoreDatabaseRaw = dbmage.DatabaseLike<
	SchemaToUnconstrainedTables<StoreSchema>
>
