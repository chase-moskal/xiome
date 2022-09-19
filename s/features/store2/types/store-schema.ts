
import * as dbmage from "dbmage"
import {SchemaToUnconstrainedTables} from "../../../framework/api/types/unconstrained-tables.js"

export type StoreSchema = dbmage.AsSchema<{
	merchants: {
		stripeAccounts: MerchantRow
	}
	subscriptions: {
		plans: SubscriptionPlanRow
		tiers: SubscriptionTierRow
	}
	billing: {
		customers: CustomerRow
	}
}>

export type StoreDatabase = dbmage.Database<StoreSchema>
export type StoreDatabaseRaw = dbmage.DatabaseLike<SchemaToUnconstrainedTables<StoreSchema>>

//
// merchant tables
//

export type MerchantRow = dbmage.AsRow<{
	time: number
	userId: dbmage.Id
	paused: boolean
	stripeAccountId: string
}>

//
// billing tables
//

export type CustomerRow = dbmage.AsRow<{
	userId: dbmage.Id
	stripeCustomerId: string
}>

//
// subscription tables
//

export type SubscriptionPlanRow = dbmage.AsRow<{
	planId: dbmage.Id
	label: string
	time: number
	archived: boolean
}>

export type SubscriptionTierRow = dbmage.AsRow<{
	label: string
	tierId: dbmage.Id
	planId: dbmage.Id
	roleId: dbmage.Id
	time: number
	stripeProductId: string
	stripePriceId: string
}>
