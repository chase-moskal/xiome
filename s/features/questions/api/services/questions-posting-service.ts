
import * as renraku from "renraku"

import {Id, find} from "dbmage"

import {vote} from "./helpers/vote.js"
import {QuestionDraft} from "../types/question-draft.js"
import {UserMeta} from "../../../auth/types/auth-metas.js"
import {Question} from "../types/questions-and-answers.js"
import {QuestionPostRow} from "../types/questions-schema.js"
import {rateLimitQuestions} from "./helpers/rate-limiting.js"
import {boolean, schema} from "../../../../toolbox/darkvalley.js"
import {QuestionsApiOptions} from "../types/questions-api-options.js"
import {validateId} from "../../../../common/validators/validate-id.js"
import {validateQuestionDraft} from "./validation/validate-question-draft.js"
import {authenticatedQuestionsPolicy} from "./policies/questions-policies.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"
import {requireUserCanEditQuestion} from "./helpers/require-user-can-edit-question.js"

export const makeQuestionsPostingService = (
		options: QuestionsApiOptions
	) => renraku.service()

.policy(async(meta: UserMeta, headers) => {
	const auth = await authenticatedQuestionsPolicy(options)(meta, headers)
	auth.checker.requireNotHavePrivilege("banned")

	const canPostQuestions = auth.checker.hasPrivilege("post questions")
	const isModerator = auth.checker.hasPrivilege("moderate questions")
	const allowed = canPostQuestions || isModerator
	if (!allowed)
		throw new renraku.ApiError(403, "not allowed to post questions")

	return auth
})

.expose(({access, database, checker}) => ({

	async postQuestion(inputs: {questionDraft: QuestionDraft}): Promise<Question> {
		const {questionDraft} = runValidation(inputs, schema({
			questionDraft: validateQuestionDraft,
		}))
		await rateLimitQuestions({
			database,
			userId: Id.fromString(access.user.userId),
		})
		const row: QuestionPostRow = {
			questionId: options.rando.randomId(),
			authorUserId: Id.fromString(access.user.userId),
			archive: false,
			timePosted: Date.now(),
			...questionDraft,
		}
		await database.tables.questions.questionPosts.create(row)
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
		const questionId = Id.fromString(questionIdString)
		const questionPost = await database.tables.questions.questionPosts
			.readOne(find({questionId}))
		requireUserCanEditQuestion({userId: access.user.userId, checker, questionPost})
		await database.tables.questions.questionPosts.update({
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
			voteTable: database.tables.questions.likes,
			userId: Id.fromString(access.user.userId),
			itemId: Id.fromString(questionIdString),
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
			voteTable: database.tables.questions.reports,
			userId: Id.fromString(access.user.userId),
			itemId: Id.fromString(questionIdString),
		})
	},
}))
