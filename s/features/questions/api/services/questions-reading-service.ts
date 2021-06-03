
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {QuestionReaderAuth} from "../types/questions-persona.js"
import {AnonMeta} from "../../../auth/policies/types/anon-meta.js"
import {apiContext2} from "../../../../framework/api/api-context2.js"
import {QuestionsApiOptions} from "../types/questions-api-options.js"
import {anonQuestionsPolicy} from "./policies/anon-questions-policy.js"
import {fetchUsers} from "../../../auth/topics/login/user/fetch-users.js"
import {resolveQuestions} from "../../topics/helpers/resolve-questions.js"
import {makePermissionsEngine} from "../../../../assembly/backend/permissions2/permissions-engine.js"

export const questionsReadingService = (options: QuestionsApiOptions) => apiContext2<
		AnonMeta,
		QuestionReaderAuth
	>()({
	policy: anonQuestionsPolicy(options),
	expose: {

		async fetchQuestions(
				{questionsTables, tables, access},
				{board}: {board: string}
			) {
			
			const posts = await questionsTables.questionPosts
				.read(find({board, archive: false}))

			const permissionsEngine = makePermissionsEngine({
				isPlatform: access.appId === options.config.platform.appDetails.appId,
				permissionsTables: tables.permissions,
			})

			const users = await fetchUsers({
				permissionsEngine,
				authTables: tables,
				userIds: posts.map(p => p.authorUserId),
			})

			const questions = await resolveQuestions({
				posts,
				questionsTables,
				userId: access?.user?.userId,
			})

			return {questions, users}
		},
	},
})
