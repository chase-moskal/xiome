
import * as dbmage from "dbmage"

import {CustomerRow} from "./rows/customer-row.js"
import {ActiveConnectRow} from "./rows/active-connect-row.js"
import {ConnectAccountRow} from "./rows/connected-account-row.js"
import {SubscriptionTierRow} from "./rows/subscription-tier-row.js"
import {SubscriptionPlanRow} from "./rows/subscription-plan-row.js"
import {ConnectConstraint} from "../get-connected-store-database.js"
import {SchemaToUnconstrainedTables} from "../../../../../framework/api/types/unconstrained-tables.js"

/*

working with the store database, you'll probably have access to:

	`storeDatabaseUnconnected`
		- this doesn't have any store-level namespacing.
		- you should use this for code that is managing which stripe account is connected to a xiome app.

	`storeDatabase`
		- some of the tables here are namespaced according to which stripe account is connected.
		- certain tables are "locked" to the connected stripe account.
		- this is so that we don't accidentally mix up the customers between different stripe accounts.
		- you should usually be using this one, to be safe that you're not mixing up data between stripe accounts.

*/

export type StoreSchemaPartsThatManageConnections = dbmage.AsSchema<{
	connect: {
		accounts: ConnectAccountRow
		active: ActiveConnectRow
	}
}>

export type StoreSchemaPartsThatRequireConnection = dbmage.AsSchema<{
	customers: CustomerRow
	subscriptions: {
		plans: SubscriptionPlanRow
		tiers: SubscriptionTierRow
	}
}>

export type StoreSchemaUnconnected = (
	StoreSchemaPartsThatManageConnections
	& dbmage.UnconstrainSchema<ConnectConstraint, StoreSchemaPartsThatRequireConnection>
)

export type StoreSchema = (
	StoreSchemaPartsThatManageConnections
	& StoreSchemaPartsThatRequireConnection
)

export type StoreTablesUnconnected = dbmage.SchemaToTables<StoreSchemaUnconnected>
export type StoreTables = dbmage.SchemaToTables<StoreSchema>

export type StoreConnectTables = StoreTablesUnconnected["connect"]

export type StoreDatabaseUnconnected = dbmage.Database<StoreSchemaUnconnected>
export type StoreDatabase = dbmage.Database<StoreSchema>

export type StoreDatabaseRaw = dbmage.DatabaseLike<
	SchemaToUnconstrainedTables<StoreSchema>
>
