
import {StoreSchema} from "../../types/store-schema.js"
import {FlexStorage} from "dbmage"
import {mockStorageTables} from "../../../../assembly/backend/tools/mock-storage-tables.js"

export async function mockStoreTables(tableStorage: FlexStorage) {
	return mockStorageTables<StoreSchema>(tableStorage, {
		merchant: {
			stripeAccounts: true,
		},
		subscription: {
			plans: true,
			tiers: true,
		},
		// billing: {
		// 	subscriptions: true,
		// 	customers: true,
		// 	subscriptionPlans: true,
		// 	storeInfo: true,
		// }),
	})
}
