
import {AuthSchema} from "../types/auth-schema.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {mockStorageTables} from "../../../assembly/backend/tools/mock-storage-tables.js"

export async function mockAuthTables(tableStorage: FlexStorage) {
	return {
		users: await mockStorageTables<AuthSchema["users"]>(tableStorage, {
			accounts: true,
			emails: true,
			latestLogins: true,
			profiles: true,
		}),
		permissions: await mockStorageTables<AuthSchema["permissions"]>(tableStorage, {
			privilege: true,
			role: true,
			roleHasPrivilege: true,
			userHasRole: true,
		}),
	}
}
