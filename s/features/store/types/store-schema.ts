
import * as dbmage from "dbmage"

export type StoreSchema = dbmage.AsSchema<{
	merchants: {
		stripeAccounts: MerchantRow
	}
	subscriptions: {
		plans: SubscriptionPlanRow
		tiers: SubscriptionTierRow
	}
}>

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
// subscription tables
//

export type SubscriptionPlanRow = dbmage.AsRow<{
	label: string
	planId: dbmage.Id
	roleId: dbmage.Id
	time: number
	stripeAccountId: string
	stripeProductId: string
}>

export type SubscriptionTierRow = dbmage.AsRow<{
	label: string
	tierId: dbmage.Id
	planId: dbmage.Id
	roleId: dbmage.Id
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
