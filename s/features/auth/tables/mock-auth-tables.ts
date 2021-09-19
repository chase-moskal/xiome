
import {AuthTables} from "../types/auth-tables.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {mockStorageTables} from "../../../assembly/backend/tools/mock-storage-tables.js"

export async function mockAuthTables(tableStorage: FlexStorage) {
	return {
		users: await mockStorageTables<AuthTables["users"]>(tableStorage, {
			accounts: true,
			emails: true,
			latestLogins: true,
			profiles: true,
		}),
		permissions: await mockStorageTables<AuthTables["permissions"]>(tableStorage, {
			privilege: true,
			role: true,
			roleHasPrivilege: true,
			userHasRole: true,
		}),
	}
}
