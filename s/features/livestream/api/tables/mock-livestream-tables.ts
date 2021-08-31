
import {LivestreamTables} from "../types/livestream-tables.js"
import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
import {mockStorageTables} from "../../../../assembly/backend/tools/mock-storage-tables.js"

export async function mockLivestreamTables(tableStorage: FlexStorage) {
	return await mockStorageTables<LivestreamTables>(tableStorage, {
		examplePosts: true,
	})
}
