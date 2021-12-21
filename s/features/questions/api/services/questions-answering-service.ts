
import * as renraku from "renraku"

import {vote} from "./helpers/vote.js"
import {AnswerDraft} from "../types/answer-draft.js"
import {Answer} from "../types/questions-and-answers.js"
import {UserMeta} from "../../../auth/types/auth-metas.js"
import {rateLimitAnswers} from "./helpers/rate-limiting.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {boolean, schema} from "../../../../toolbox/darkvalley.js"
import {AnswerPostRow} from "../tables/types/questions-tables.js"
import {QuestionsApiOptions} from "../types/questions-api-options.js"
import {validateId} from "../../../../common/validators/validate-id.js"
import {validateAnswerDraft} from "./validation/validate-question-draft.js"
import {requireUserCanEditAnswer} from "./helpers/require-user-can-edit-answer.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"
import {authenticatedQuestionsPolicy} from "./policies/authenticated-questions-policy.js"

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

.expose(({access, questionsTables, checker}) => ({

	async postAnswer(inputs: {questionId: string, answerDraft: AnswerDraft}) {
		const {questionId: questionIdString, answerDraft} = runValidation(
			inputs,
			schema({
				questionId: validateId,
				answerDraft: validateAnswerDraft,
			})
		)
		const questionId = DamnId.fromString(questionIdString)
		const questionPost = await questionsTables.questionPosts
			.one(find({questionId}))
		if (!questionPost)
			throw new renraku.ApiError(400, "unknown questionId")
		const userId = DamnId.fromString(access.user.userId)
		await rateLimitAnswers({
			userId,
			questionId,
			questionsTables,
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
		await questionsTables.answerPosts.create(row)
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
		const answerId = DamnId.fromString(answerIdString)
		const answerPost = await questionsTables.answerPosts.one(find({answerId}))
		requireUserCanEditAnswer({userId: access.user.userId, checker, answerPost})
		await questionsTables.answerPosts.update({
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
			voteTable: questionsTables.likes,
			userId: DamnId.fromString(access.user.userId),
			itemId: DamnId.fromString(answerIdString),
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
			voteTable: questionsTables.reports,
			userId: DamnId.fromString(access.user.userId),
			itemId: DamnId.fromString(answerIdString),
		})
	},
}))
