
import * as dbmage from "dbmage"
import {StoreSchema} from "../../types/store-schema.js"

export async function mockStoreTables(flexStorage: dbmage.FlexStorage) {
	return dbmage.flex<StoreSchema>({
		flexStorage,
		shape: {
			merchants: {
				stripeAccounts: true,
			},
			subscriptions: {
				plans: true,
				tiers: true,
			},
			billing: {
				paymentMethods: true,
			},
		},
	})
}
