
import {AppTables} from "../types/app-tables"
import {UserTables} from "../types/user-tables"
import {PermissionsTables} from "../types/permissions-tables"
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
	}
}
