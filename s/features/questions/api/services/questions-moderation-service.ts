
import * as renraku from "renraku"
import {find} from "dbmage"

import {UserMeta} from "../../../auth/types/auth-metas.js"
import {QuestionsApiOptions} from "../types/questions-api-options.js"
import {authenticatedQuestionsPolicy} from "./policies/questions-policies.js"

export const makeQuestionsModerationService = (
	options: QuestionsApiOptions
) => renraku.service()

.policy(async(meta: UserMeta, headers) => {
	const auth = await authenticatedQuestionsPolicy(options)(meta, headers)
	auth.checker.requirePrivilege("moderate questions")
	auth.checker.requireNotHavePrivilege("banned")
	return auth
})

.expose(({database}) => ({

	async archiveBoard({board}: {board: string}) {
		await database.tables.questions.questionPosts.update({
			...find({board}),
			write: {archive: true},
		})
	},

	async fetchReportedQuestions() {},
}))
