
import {BillingTables} from "./types/billing-tables.js"
import {AuthTables} from "../../../auth/tables/types/auth-tables.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
import {mockStorageTables} from "../../../../assembly/backend/tools/mock-storage-tables.js"

export async function mockPayTables(tableStorage: FlexStorage) {
	return {
		billing: await mockStorageTables<BillingTables>(tableStorage, {
			stripeAccounts: true,
			stripePremiums: true,
			stripeCustomers: true,
		}),
	}
}
