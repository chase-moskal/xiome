
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {resolveQuestions} from "./helpers/resolve-questions.js"
import {AnonMeta} from "../../../auth/policies/types/anon-meta.js"
import {AnonAuth} from "../../../auth/policies/types/anon-auth.js"
import {QuestionsAuthParts} from "../types/questions-auth-parts.js"
import {QuestionsApiOptions} from "../types/questions-api-options.js"
import {anonQuestionsPolicy} from "./policies/anon-questions-policy.js"
import {fetchUsers} from "../../../auth/topics/login/user/fetch-users.js"
import {asServiceParts} from "../../../../framework/api/as-service-parts.js"
import {makePermissionsEngine} from "../../../../assembly/backend/permissions2/permissions-engine.js"

export const questionsReadingParts = (
		options: QuestionsApiOptions
	) => asServiceParts<AnonMeta, QuestionsAuthParts & AnonAuth>()({

	policy: async(meta, request) => {
		const auth = await anonQuestionsPolicy(options)(meta, request)
		auth.checker.requirePrivilege("read questions")
		return auth
	},

	expose: {

		async fetchQuestions(
				{questionsTables, tables, access},
				{board}: {board: string},
			) {

			const posts = await questionsTables.questionPosts
				.read({
					...find({board, archive: false}),
					limit: 100,
					offset: 0,
					order: {timePosted: "descend"},
				})

			let questions = []
			let users = []
			if (posts.length) {
				const permissionsEngine = makePermissionsEngine({
					isPlatform: access.appId === options.config.platform.appDetails.appId,
					permissionsTables: tables.permissions,
				})

				users = await fetchUsers({
					permissionsEngine,
					authTables: tables,
					userIds: posts.map(p => p.authorUserId),
				})

				questions = await resolveQuestions({
					posts,
					questionsTables,
					userId: access?.user?.userId,
				})
			}

			return {questions, users}
		},
	},
})
