
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
import {MerchantTables, SubscriptionTables} from "../../types/store-tables.js"
import {mockStorageTables} from "../../../../assembly/backend/tools/mock-storage-tables.js"

export async function mockStoreTables(tableStorage: FlexStorage) {
	return {
		merchant: await mockStorageTables<MerchantTables>(
			tableStorage,
			{
				stripeAccounts: true,
			}
		),
		subscription: await mockStorageTables<SubscriptionTables>(
			tableStorage,
			{
				plans: true,
				tiers: true,
			}
		)
		// billing: await mockStorageTables<BillingTables>(tableStorage, {
		// 	subscriptions: true,
		// 	customers: true,
		// 	subscriptionPlans: true,
		// 	storeInfo: true,
		// }),
	}
}
