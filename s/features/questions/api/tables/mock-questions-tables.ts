
import {QuestionsTables} from "./types/questions-tables.js"

import {FlexStorage} from "../../../../toolbox/flex-storage/types/flex-storage.js"
import {mockStorageTables} from "../../../../assembly/backend/tools/mock-storage-tables.js"

export async function mockQuestionsTables(tableStorage: FlexStorage) {
	return await mockStorageTables<QuestionsTables>(tableStorage, {
		questionPosts: true,
		questionLikes: true,
		questionReports: true,
	})
}
