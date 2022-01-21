
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"

import {Await} from "../../../types/await.js"
import {mockStoreTables} from "../api/tables/mock-store-tables.js"
// import {CardClues} from "../stripe/liaison/types/card-clues.js"

export type StoreTables = Await<ReturnType<typeof mockStoreTables>>

//
// merchant tables
//

export type MerchantTables = dbproxy.AsSchema<{
	stripeAccounts: MerchantRow
}>

export type MerchantRow = dbproxy.AsRow<{
	time: number
	userId: dbproxy.Id
	paused: boolean
	stripeAccountId: string
}>

//
// subscription tables
//

export type SubscriptionTables = dbproxy.AsSchema<{
	plans: SubscriptionPlanRow
	tiers: SubscriptionTierRow
}>

export type SubscriptionPlanRow = dbproxy.AsRow<{
	label: string
	planId: dbproxy.Id
	roleId: dbproxy.Id
	time: number
	stripeAccountId: string
	stripeProductId: string
}>

export type SubscriptionTierRow = dbproxy.AsRow<{
	label: string
	tierId: dbproxy.Id
	planId: dbproxy.Id
	roleId: dbproxy.Id
	time: number
	stripePriceId: string
	stripeAccountId: string
}>







// //
// // billing tables
// //

// export type BillingTables = {
// 	customers: DbbyTable<CustomerRow>
// 	storeInfo: DbbyTable<StoreInfoRow>
// 	subscriptions: DbbyTable<SubscriptionRow>
// 	subscriptionPlans: DbbyTable<SubscriptionPlanRow>
// }

// export type CustomerRow = {
// 	userId: string
// 	stripeCustomerId: string
// }

// export type StoreInfoRow = {
// 	ecommerceActive: boolean
// }

// export type SubscriptionRow = {
// 	userId: string
// 	subscriptionPlanId: string
// 	stripeSubscriptionId: string
// } & CardClues

// export type SubscriptionPlanRow = {
// 	subscriptionPlanId: DamnId
// 	stripeProductId: string
// 	roleId: DamnId
// }
