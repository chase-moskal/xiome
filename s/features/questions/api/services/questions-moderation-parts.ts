
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {UserMeta} from "../../../auth/policies/types/user-meta.js"
import {UserAuth} from "../../../auth/policies/types/user-auth.js"
import {QuestionsAuthParts} from "../types/questions-auth-parts.js"
import {QuestionsApiOptions} from "../types/questions-api-options.js"
import {asServiceParts} from "../../../../framework/api/as-service-parts.js"
import {authenticatedQuestionsPolicy} from "./policies/authenticated-questions-policy.js"

export const questionsModerationParts = (
		options: QuestionsApiOptions
	) => asServiceParts<
		UserMeta,
		QuestionsAuthParts & UserAuth
	>()({

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
	},
})
