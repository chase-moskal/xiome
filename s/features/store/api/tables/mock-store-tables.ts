
import {BillingTables} from "./types/billing-tables.js"
import {MerchantTables} from "./types/merchant-tables.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
import {mockStorageTables} from "../../../../assembly/backend/tools/mock-storage-tables.js"

export async function mockStoreTables(tableStorage: FlexStorage) {
	return {
		billing: await mockStorageTables<BillingTables>(tableStorage, {
			subscriptions: true,
			customers: true,
			subscriptionPlans: true,
			storeInfo: true,
		}),
		merchant: await mockStorageTables<MerchantTables>(tableStorage, {
			stripeAccounts: true,
		}),
	}
}
