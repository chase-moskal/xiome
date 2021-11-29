
import {Await} from "../../../../types/await.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {mockStoreTables} from "../tables/mock-store-tables.js"
import {DbbyTable} from "../../../../toolbox/dbby/dbby-types.js"
import {CardClues} from "../../stripe2/liaison/types/card-clues.js"

export type StoreTables = Await<ReturnType<typeof mockStoreTables>>

//
// billing tables
//

export type BillingTables = {
	customers: DbbyTable<CustomerRow>
	storeInfo: DbbyTable<StoreInfoRow>
	subscriptions: DbbyTable<SubscriptionRow>
	subscriptionPlans: DbbyTable<SubscriptionPlanRow>
}

export type CustomerRow = {
	userId: string
	stripeCustomerId: string
}

export type StoreInfoRow = {
	ecommerceActive: boolean
}

export type SubscriptionRow = {
	userId: string
	subscriptionPlanId: string
	stripeSubscriptionId: string
} & CardClues

export type SubscriptionPlanRow = {
	subscriptionPlanId: DamnId
	stripeProductId: string
	roleId: DamnId
}

//
// merchant tables
//

export type MerchantTables = {
	stripeAccounts: DbbyTable<MerchantRow>
}

export type MerchantRow = {
	timeLinked: number
	stripeAccountId: string
}
