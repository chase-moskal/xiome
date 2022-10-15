
import * as dbmage from "dbmage"

import {StoreDatabaseRaw, StoreSchema} from "./types/schema.js"
import {UnconstrainedTable} from "../../../../framework/api/unconstrained-table.js"

export function mockStoreDatabaseRaw(): StoreDatabaseRaw {
	return (
		UnconstrainedTable.wrapDatabase(dbmage.memory<StoreSchema>({
			shape: {
				customers: true,
				connect: {
					accounts: true,
					active: true,
				},
				subscriptions: {
					plans: true,
					tiers: true,
				},
			}
		}))
	)
}
