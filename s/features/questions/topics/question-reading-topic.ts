
import {asTopic} from "renraku/x/identities/as-topic.js"
import {find} from "../../../toolbox/dbby/dbby-helpers.js"
import {fetchUser} from "../../auth/topics/login/user/fetch-user.js"
import {QuestionReaderAuth} from "../api/types/questions-persona.js"
import {Question} from "./types/question.js"

export const questionReadingTopic = ({generateNickname}: {generateNickname: () => string}) => asTopic<QuestionReaderAuth>()({

	async fetchQuestions(
			{questionsTables, tables},
			{board}: {board: string}
		) {
		
		const questions: Question[] = await questionsTables.questionPosts
			.read(find({board}))

		const users = await Promise.all(questions.map(
			async question => fetchUser({
				userId: question.authorUserId,
				tables,
				generateNickname,
			})
		))

		return {questions, users}
	},
})
