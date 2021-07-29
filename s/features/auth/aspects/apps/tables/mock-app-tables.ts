
import {AppTables} from "../types/app-tables.js"
import {FlexStorage} from "../../../../../toolbox/flex-storage/types/flex-storage.js"
import {mockStorageTables} from "../../../../../assembly/backend/tools/mock-storage-tables.js"

export async function mockAppTables(storage: FlexStorage) {
	return mockStorageTables<AppTables>(storage, {
		registrations: true,
		owners: true,
	})
}
