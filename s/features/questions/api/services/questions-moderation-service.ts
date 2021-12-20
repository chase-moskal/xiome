
import {renrakuService} from "renraku"

import {UserMeta} from "../../../auth/types/auth-metas.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {QuestionsApiOptions} from "../types/questions-api-options.js"
import {authenticatedQuestionsPolicy} from "./policies/authenticated-questions-policy.js"

export const makeQuestionsModerationService = (
	options: QuestionsApiOptions
) => renrakuService()

.policy(async(meta: UserMeta, headers) => {
	const auth = await authenticatedQuestionsPolicy(options)(meta, headers)
	auth.checker.requirePrivilege("moderate questions")
	auth.checker.requireNotHavePrivilege("banned")
	return auth
})

.expose(({questionsTables}) => ({

	async archiveBoard({board}: {board: string}) {
		await questionsTables.questionPosts.update({
			...find({board}),
			write: {archive: true},
		})
	},

	// TODO implement
	async fetchReportedQuestions() {},
}))
