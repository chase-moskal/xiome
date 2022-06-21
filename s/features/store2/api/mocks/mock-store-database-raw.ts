
import * as dbmage from "dbmage"
import {StoreDatabaseRaw, StoreSchema} from "../../types/store-schema.js"
import {UnconstrainedTable} from "../../../../framework/api/unconstrained-table.js"

export function mockStoreDatabaseRaw(): StoreDatabaseRaw {
	return (UnconstrainedTable
		.wrapDatabase(dbmage.memory<StoreSchema>({
			shape: {
				billing: {
					customers: true,
				},
				merchants: {
					stripeAccounts: true,
				},
				subscriptions: {
					plans: true,
					tiers: true,
				},
			}
		}))
	)
}
