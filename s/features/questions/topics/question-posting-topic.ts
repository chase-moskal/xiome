
import {Rando} from "../../../toolbox/get-rando.js"
import {QuestionDraft} from "./types/question-draft.js"
import {asTopic} from "renraku/x/identities/as-topic.js"
import {QuestionPosterAuth} from "../api/questions-policies.js"
import {QuestionPostRow} from "../api/tables/types/questions-tables.js"
import {validateQuestionDraft} from "./validation/validate-question-draft.js"
import {throwProblems} from "../../../toolbox/topic-validation/throw-problems.js"

export const questionPostingTopic = ({rando}: {
		rando: Rando
	}) => asTopic<QuestionPosterAuth>()({

	async postQuestion(
			{questionsTables, access},
			{questionDraft}: {questionDraft: QuestionDraft},
		) {
		throwProblems(validateQuestionDraft(questionDraft))
		const row: QuestionPostRow = {
			questionId: rando.randomId(),
			authorUserId: access.user.userId,
			archive: false,
			timePosted: Date.now(),
			...questionDraft,
		}
		await questionsTables.questionPosts.create(row)
		return row
	},
})
