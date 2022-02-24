
import * as dbmage from "dbmage"

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

// export type PaymentMethodRow = dbmage.AsRow<{
// 	userId: dbmage.Id
// 	stripePaymentMethodId: string
// }>

//
// subscription tables
//

// export type SubscriptionPurchaseRow = dbmage.AsRow<{
// 	userId: dbmage.Id
// 	stripeSubscriptionId: string
// 	time: number
// }>

export type SubscriptionPlanRow = dbmage.AsRow<{
	label: string
	planId: dbmage.Id
	roleId: dbmage.Id
	time: number
	stripeProductId: string
}>

export type SubscriptionTierRow = dbmage.AsRow<{
	label: string
	tierId: dbmage.Id
	planId: dbmage.Id
	roleId: dbmage.Id
	time: number
	stripePriceId: string
}>

// //
// // ownership tables
// //

// export type OwnedSubscriptionRow = dbmage.AsRow<{
// 	tierId: dbmage.Id
// 	planId: dbmage.Id
// 	time: number
// }>






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
