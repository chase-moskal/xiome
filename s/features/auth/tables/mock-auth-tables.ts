
import {AuthSchema} from "../types/auth-schema.js"
import {FlexStorage} from "dbmage"
import {mockStorageTables} from "../../../assembly/backend/tools/mock-storage-tables.js"

export function mockAuthTables(tableStorage: FlexStorage) {
	return mockStorageTables<AuthSchema>(tableStorage, {
		users: {
			accounts: true,
			emails: true,
			latestLogins: true,
			profiles: true,
		},
		permissions: {
			privilege: true,
			role: true,
			roleHasPrivilege: true,
			userHasRole: true,
		},
	})
}
