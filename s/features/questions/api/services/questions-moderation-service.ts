
import {apiContext} from "renraku/x/api/api-context.js"

import {UserMeta} from "../../../auth/types/auth-metas.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {QuestionsApiOptions} from "../types/questions-api-options.js"
import {QuestionsUserAuth} from "../types/questions-metas-and-auths.js"
import {authenticatedQuestionsPolicy} from "./policies/authenticated-questions-policy.js"

export const makeQuestionsModerationService = (
	options: QuestionsApiOptions
	) => apiContext<UserMeta, QuestionsUserAuth>()({

	policy: async(meta, request) => {
		const auth = await authenticatedQuestionsPolicy(options)(meta, request)
		auth.checker.requirePrivilege("moderate questions")
		auth.checker.requireNotHavePrivilege("banned")
		return auth
	},

	expose: {

		async archiveBoard(
				{questionsTables},
				{board}: {board: string}
			) {

			await questionsTables.questionPosts.update({
				...find({board}),
				write: {archive: true},
			})
		},

		// TODO implement
		async fetchReportedQuestions() {},
	},
})
