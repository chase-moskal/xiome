
import {renrakuService, RenrakuError} from "renraku"

import {vote} from "./helpers/vote.js"
import {QuestionDraft} from "../types/question-draft.js"
import {UserMeta} from "../../../auth/types/auth-metas.js"
import {Question} from "../types/questions-and-answers.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {rateLimitQuestions} from "./helpers/rate-limiting.js"
import {boolean, schema} from "../../../../toolbox/darkvalley.js"
import {QuestionPostRow} from "../tables/types/questions-tables.js"
import {QuestionsApiOptions} from "../types/questions-api-options.js"
import {validateId} from "../../../../common/validators/validate-id.js"
import {validateQuestionDraft} from "./validation/validate-question-draft.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"
import {requireUserCanEditQuestion} from "./helpers/require-user-can-edit-question.js"
import {authenticatedQuestionsPolicy} from "./policies/authenticated-questions-policy.js"

export const makeQuestionsPostingService = (
		options: QuestionsApiOptions
	) => renrakuService()

.policy(async(meta: UserMeta, headers) => {
	const auth = await authenticatedQuestionsPolicy(options)(meta, headers)
	auth.checker.requireNotHavePrivilege("banned")

	const canPostQuestions = auth.checker.hasPrivilege("post questions")
	const isModerator = auth.checker.hasPrivilege("moderate questions")
	const allowed = canPostQuestions || isModerator
	if (!allowed)
		throw new RenrakuError(403, "not allowed to post questions")

	return auth
})

.expose(({access, questionsTables, checker}) => ({

	async postQuestion(inputs: {questionDraft: QuestionDraft}): Promise<Question> {
		const {questionDraft} = runValidation(inputs, schema({
			questionDraft: validateQuestionDraft,
		}))
		await rateLimitQuestions({
			questionsTables,
			userId: DamnId.fromString(access.user.userId),
		})
		const row: QuestionPostRow = {
			questionId: options.rando.randomId(),
			authorUserId: DamnId.fromString(access.user.userId),
			archive: false,
			timePosted: Date.now(),
			...questionDraft,
		}
		await questionsTables.questionPosts.create(row)
		return {
			archive: row.archive,
			authorUserId: row.authorUserId.toString(),
			questionId: row.questionId.toString(),
			content: row.content,
			timePosted: row.timePosted,
			board: row.board,
			likes: 0,
			reports: 0,
			liked: false,
			reported: false,
			answers: [],
		}
	},

	async archiveQuestion(inputs: {archive: boolean, questionId: string}) {
		const {archive, questionId: questionIdString} = runValidation(
			inputs,
			schema({
				archive: boolean(),
				questionId: validateId,
			}),
		)
		const questionId = DamnId.fromString(questionIdString)
		const questionPost = await questionsTables.questionPosts
			.one(find({questionId}))
		requireUserCanEditQuestion({userId: access.user.userId, checker, questionPost})
		await questionsTables.questionPosts.update({
			...find({questionId}),
			write: {archive: !!archive},
		})
	},

	async likeQuestion(inputs: {like: boolean, questionId: string}) {
		const {like, questionId: questionIdString} = runValidation(
			inputs,
			schema({
				like: boolean(),
				questionId: validateId,
			}),
		)
		checker.requirePrivilege("like questions")
		await vote({
			status: like,
			voteTable: questionsTables.likes,
			userId: DamnId.fromString(access.user.userId),
			itemId: DamnId.fromString(questionIdString),
		})
	},

	async reportQuestion(inputs: {report: boolean, questionId: string}) {
		const {report, questionId: questionIdString} = runValidation(
			inputs,
			schema({
				report: boolean(),
				questionId: validateId,
			}),
		)
		checker.requirePrivilege("report questions")
		await vote({
			status: report,
			voteTable: questionsTables.reports,
			userId: DamnId.fromString(access.user.userId),
			itemId: DamnId.fromString(questionIdString),
		})
	},
}))
