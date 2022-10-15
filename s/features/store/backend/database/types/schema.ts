
import * as dbmage from "dbmage"

import {CustomerRow} from "./rows/customer-row.js"
import {ActiveConnectRow} from "./rows/active-connect-row.js"
import {ConnectAccountRow} from "./rows/connected-account-row.js"
import {SubscriptionTierRow} from "./rows/subscription-tier-row.js"
import {SubscriptionPlanRow} from "./rows/subscription-plan-row.js"
import {SchemaToUnconstrainedTables} from "../../../../../framework/api/types/unconstrained-tables.js"

export type StoreSchema = dbmage.AsSchema<{
	customers: CustomerRow
	connect: {
		accounts: ConnectAccountRow
		active: ActiveConnectRow
	}
	subscriptions: {
		plans: SubscriptionPlanRow
		tiers: SubscriptionTierRow
	}
}>

export type StoreDatabase = dbmage.Database<StoreSchema>

export type StoreDatabaseRaw = dbmage.DatabaseLike<
	SchemaToUnconstrainedTables<StoreSchema>
>
