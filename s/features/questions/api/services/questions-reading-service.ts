
import {apiContext} from "renraku/x/api/api-context.js"

import {AnonMeta} from "../../../auth2/types/auth-metas.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {resolveQuestions} from "./helpers/resolve-questions.js"
import {QuestionsApiOptions} from "../types/questions-api-options.js"
import {QuestionsAnonAuth} from "../types/questions-metas-and-auths.js"
import {anonQuestionsPolicy} from "./policies/anon-questions-policy.js"
import {fetchUsers} from "../../../auth2/aspects/users/routines/user/fetch-users.js"
import {makePermissionsEngine} from "../../../../assembly/backend/permissions2/permissions-engine.js"

export const makeQuestionsReadingService = (
	options: QuestionsApiOptions
	) => apiContext<AnonMeta, QuestionsAnonAuth>()({
	policy: async(meta, request) => {
		const auth = await anonQuestionsPolicy(options)(meta, request)
		auth.checker.requirePrivilege("read questions")
		return auth
	},
	expose: {

		async fetchQuestions(
				{access, authTables, questionsTables},
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
					permissionsTables: authTables.permissions,
				})

				users = await fetchUsers({
					permissionsEngine,
					authTables,
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
