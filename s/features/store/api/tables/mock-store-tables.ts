
import {MerchantTables} from "../../types/store-tables.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
import {mockStorageTables} from "../../../../assembly/backend/tools/mock-storage-tables.js"

export async function mockStoreTables(tableStorage: FlexStorage) {
	return {
		merchant: await mockStorageTables<MerchantTables>(tableStorage, {
			stripeAccounts: true,
		}),
		// billing: await mockStorageTables<BillingTables>(tableStorage, {
		// 	subscriptions: true,
		// 	customers: true,
		// 	subscriptionPlans: true,
		// 	storeInfo: true,
		// }),
	}
}
