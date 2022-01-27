
import {QuestionsSchema} from "../types/questions-schema.js"

import {FlexStorage} from "dbmage"
import {mockStorageTables} from "../../../../assembly/backend/tools/mock-storage-tables.js"

export async function mockQuestionsTables(tableStorage: FlexStorage) {
	return await mockStorageTables<QuestionsSchema>(tableStorage, {
		questionPosts: true,
		answerPosts: true,
		likes: true,
		reports: true,
	})
}
