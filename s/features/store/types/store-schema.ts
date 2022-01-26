
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"

export type StoreSchema = dbproxy.AsSchema<{
	merchant: MerchantSchema
	subscription: SubscriptionSchema
}>

//
// merchant tables
//

export type MerchantSchema = dbproxy.AsSchema<{
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

export type SubscriptionSchema = dbproxy.AsSchema<{
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
