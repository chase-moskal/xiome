
import * as renraku from "renraku"
import {Id, find} from "dbmage"

import {vote} from "./helpers/vote.js"
import {AnswerDraft} from "../types/answer-draft.js"
import {Answer} from "../types/questions-and-answers.js"
import {UserMeta} from "../../../auth/types/auth-metas.js"
import {AnswerPostRow} from "../types/questions-schema.js"
import {rateLimitAnswers} from "./helpers/rate-limiting.js"
import {boolean, schema} from "../../../../toolbox/darkvalley.js"
import {QuestionsApiOptions} from "../types/questions-api-options.js"
import {validateId} from "../../../../common/validators/validate-id.js"
import {validateAnswerDraft} from "./validation/validate-question-draft.js"
import {authenticatedQuestionsPolicy} from "./policies/questions-policies.js"
import {requireUserCanEditAnswer} from "./helpers/require-user-can-edit-answer.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"

export const makeQuestionsAnsweringService = (
	options: QuestionsApiOptions
) => renraku.service()

.policy(async(meta: UserMeta, request) => {
	const auth = await authenticatedQuestionsPolicy(options)(meta, request)
	auth.checker.requireNotHavePrivilege("banned")

	const canPostQuestions = auth.checker.hasPrivilege("answer questions")
	const isModerator = auth.checker.hasPrivilege("moderate questions")
	const allowed = canPostQuestions || isModerator
	if (!allowed)
		throw new renraku.ApiError(403, "not allowed to post questions")

	return auth
})

.expose(({access, database, checker}) => ({

	async postAnswer(inputs: {questionId: string, answerDraft: AnswerDraft}) {
		const {questionId: questionIdString, answerDraft} = runValidation(
			inputs,
			schema({
				questionId: validateId,
				answerDraft: validateAnswerDraft,
			})
		)
		const questionId = Id.fromString(questionIdString)
		const questionPost = await database.tables.questions.questionPosts
			.readOne(find({questionId}))
		if (!questionPost)
			throw new renraku.ApiError(400, "unknown questionId")
		const userId = Id.fromString(access.user.userId)
		await rateLimitAnswers({
			userId,
			database,
			questionId,
		})
		const row: AnswerPostRow = {
			questionId,
			answerId: options.rando.randomId(),
			authorUserId: userId,
			archive: false,
			timePosted: Date.now(),
			board: questionPost.board,
			...answerDraft,
		}
		await database.tables.questions.answerPosts.create(row)
		const answer: Answer = {
			answerId: row.answerId.toString(),
			questionId: row.questionId.toString(),
			authorUserId: row.authorUserId.toString(),
			content: row.content,
			timePosted: row.timePosted,
			liked: false,
			likes: 0,
			archive: false,
			reported: false,
			reports: 0,
		}
		return answer
	},

	async archiveAnswer(inputs: {archive: boolean, answerId: string}) {
		const {archive, answerId: answerIdString} = runValidation(
			inputs,
			schema({
				archive: boolean(),
				answerId: validateId,
			}),
		)
		const answerId = Id.fromString(answerIdString)
		const answerPost = await database.tables.questions.answerPosts.readOne(find({answerId}))
		requireUserCanEditAnswer({userId: access.user.userId, checker, answerPost})
		await database.tables.questions.answerPosts.update({
			...find({answerId}),
			write: {archive},
		})
	},

	async likeAnswer(
			inputs: {like: boolean, answerId: string}
		) {
		const {like, answerId: answerIdString} = runValidation(
			inputs,
			schema({
				like: boolean(),
				answerId: validateId,
			}),
		)
		checker.requirePrivilege("like questions")
		await vote({
			status: like,
			voteTable: database.tables.questions.likes,
			userId: Id.fromString(access.user.userId),
			itemId: Id.fromString(answerIdString),
		})
	},

	async reportAnswer(inputs: {report: boolean, answerId: string}) {
		const {report, answerId: answerIdString} = runValidation(
			inputs,
			schema({
				report: boolean(),
				answerId: validateId,
			}),
		)
		checker.requirePrivilege("report questions")
		await vote({
			status: report,
			voteTable: database.tables.questions.reports,
			userId: Id.fromString(access.user.userId),
			itemId: Id.fromString(answerIdString),
		})
	},
}))
