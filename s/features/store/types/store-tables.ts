
import {Await} from "../../../types/await.js"
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {DbbyTable} from "../../../toolbox/dbby/dbby-types.js"
import {CardClues} from "../stripe/liaison/types/card-clues.js"
import {mockStoreTables} from "../api/tables/mock-store-tables.js"

export type StoreTables = Await<ReturnType<typeof mockStoreTables>>

//
// merchant tables
//

export type MerchantTables = {
	stripeAccounts: DbbyTable<MerchantRow>
}

export type MerchantRow = {
	time: number
	userId: DamnId
	stripeAccountId: string
	paused: boolean
}

//
// subscription tables
//

export type SubscriptionTables = {
	plans: DbbyTable<SubscriptionPlanRow>
	tiers: DbbyTable<SubscriptionTierRow>
}

export type SubscriptionPlanRow = {
	label: string
	planId: DamnId
	roleId: DamnId
	stripeProductId: string
	time: number
}

export type SubscriptionTierRow = {
	label: string
	tierId: DamnId
	planId: DamnId
	roleId: DamnId
	stripePriceId: string
	time: number
}

export type SubscriptionTierOrderingRow = {
	planId: DamnId
	ordering: string
}









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
