
import {asTopic} from "renraku/x/identities/as-topic.js"
import {find} from "../../../toolbox/dbby/dbby-helpers.js"
import {fetchUser} from "../../auth/topics/login/user/fetch-user.js"
import {QuestionReaderAuth} from "../api/types/questions-persona.js"
import {resolveQuestions} from "./helpers/resolve-questions.js"
import {Question} from "./types/question.js"

export const questionReadingTopic = ({generateNickname}: {generateNickname: () => string}) => asTopic<QuestionReaderAuth>()({

	async fetchQuestions(
			{questionsTables, tables},
			{board}: {board: string}
		) {
		
		const posts = await questionsTables.questionPosts
			.read(find({board}))

		const users = await Promise.all(posts.map(
			async question => fetchUser({
				userId: question.authorUserId,
				tables,
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
