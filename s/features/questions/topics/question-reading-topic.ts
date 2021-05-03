
import {Question} from "./types/question.js"
import {asTopic} from "renraku/x/identities/as-topic.js"
import {find} from "../../../toolbox/dbby/dbby-helpers.js"
import {fetchUser} from "../../auth/topics/login/user/fetch-user.js"
import {QuestionReaderAuth} from "../api/types/questions-persona.js"
import {resolveQuestions} from "./helpers/resolve-questions.js"
import {PlatformConfig} from "../../../assembly/backend/types/platform-config.js"
import {makePermissionsEngine} from "../../../assembly/backend/permissions2/permissions-engine.js"

export const questionReadingTopic = ({config, generateNickname}: {
		config: PlatformConfig
		generateNickname: () => string
	}) => asTopic<QuestionReaderAuth>()({

	async fetchQuestions(
			{questionsTables, tables, access},
			{board}: {board: string}
		) {
		
		const posts = await questionsTables.questionPosts
			.read(find({board}))

		const permissionsEngine = makePermissionsEngine({
			isPlatform: access.appId === config.platform.appDetails.appId,
			permissionsTables: tables.permissions,
		})

		const users = await Promise.all(posts.map(
			async question => fetchUser({
				userId: question.authorUserId,
				tables,
				permissionsEngine,
				generateNickname,
			})
		))

		const questions = await resolveQuestions({
			posts,
			userId: undefined, // TODO we need anons to have an access object!
			questionsTables,
		})

		return {questions, users}
	},
})
