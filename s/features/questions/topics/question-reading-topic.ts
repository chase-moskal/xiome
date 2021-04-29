
import {asTopic} from "renraku/x/identities/as-topic.js"
import {find} from "../../../toolbox/dbby/dbby-helpers.js"
import {QuestionReaderAuth} from "../api/questions-policies.js"

export const questionReadingTopic = () => asTopic<QuestionReaderAuth>()({

	async fetchQuestions(
			{questionsTables},
			{board}: {board: string}
		) {
		return questionsTables.questionPosts.read(find({board}))
	},
})
