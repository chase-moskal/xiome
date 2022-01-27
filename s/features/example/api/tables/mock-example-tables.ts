
import {ExampleSchema} from "../types/example-tables.js"
import {FlexStorage} from "dbmage"
import {mockStorageTables} from "../../../../assembly/backend/tools/mock-storage-tables.js"

export async function mockQuestionsTables(tableStorage: FlexStorage) {
	return await mockStorageTables<ExampleSchema>(tableStorage, {
		examplePosts: true,
	})
}
