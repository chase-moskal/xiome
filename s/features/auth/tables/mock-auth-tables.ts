
import {PayTables} from "../../pay/api/types/tables/pay-tables.js"
import {AppTables, UserTables, PermissionsTables} from "../auth-types.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {mockStorageTables} from "../../../assembly/backend/tools/mock-storage-tables.js"

export async function mockAuthTables(tableStorage: FlexStorage) {
	return {
		app: await mockStorageTables<AppTables>(tableStorage, {
			app: true,
			appOwnership: true,
		}),
		permissions: await mockStorageTables<PermissionsTables>(tableStorage, {
			role: true,
			privilege: true,
			userHasRole: true,
			roleHasPrivilege: true,
		}),
		user: await mockStorageTables<UserTables>(tableStorage, {
			account: true,
			profile: true,
			accountViaEmail: true,
			accountViaGoogle: true,
			latestLogin: true,
		}),
		pay: await mockStorageTables<PayTables>(tableStorage, {
			stripeAccounts: true,
			stripeCustomers: true,
			stripePremiums: true,
		}),
	}
}
