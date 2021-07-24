
import {ApiError} from "renraku/x/api/api-error.js"
import {apiContext} from "renraku/x/api/api-context.js"

import {vote} from "./helpers/vote.js"
import {AnswerDraft} from "../types/answer-draft.js"
import {Answer} from "../types/questions-and-answers.js"
import {UserMeta} from "../../../auth/types/auth-metas.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {boolean, schema} from "../../../../toolbox/darkvalley.js"
import {AnswerPostRow} from "../tables/types/questions-tables.js"
import {QuestionsApiOptions} from "../types/questions-api-options.js"
import {QuestionsUserAuth} from "../types/questions-metas-and-auths.js"
import {validateQuestionDraft} from "./validation/validate-question-draft.js"
import {requireUserCanEditAnswer} from "./helpers/require-user-can-edit-answer.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"
import {validateId} from "../../../administrative/api/services/validation/validate-id.js"
import {authenticatedQuestionsPolicy} from "./policies/authenticated-questions-policy.js"

export const makeQuestionsAnsweringService = (
		options: QuestionsApiOptions
	) => apiContext<UserMeta, QuestionsUserAuth>()({

	policy: async(meta, request) => {
		const auth = await authenticatedQuestionsPolicy(options)(meta, request)
		auth.checker.requireNotHavePrivilege("banned")

		const canPostQuestions = auth.checker.hasPrivilege("answer questions")
		const isModerator = auth.checker.hasPrivilege("moderate questions")
		const allowed = canPostQuestions || isModerator
		if (!allowed)
			throw new ApiError(403, "not allowed to post questions")

		return auth
	},

	expose: {

		async postAnswer(
				{access, questionsTables},
				inputs: {questionId: string, answerDraft: AnswerDraft},
			) {
			const {questionId: questionIdString, answerDraft} = runValidation(
				inputs,
				schema({
					questionId: validateId,
					answerDraft: validateQuestionDraft,
				})
			)
			const row: AnswerPostRow = {
				questionId: DamnId.fromString(questionIdString),
				answerId: options.rando.randomId(),
				authorUserId: DamnId.fromString(access.user.userId),
				archive: false,
				timePosted: Date.now(),
				...answerDraft,
			}
			await questionsTables.answerPosts.create(row)
			const answer: Answer = {
				answerId: row.answerId.toString(),
				questionId: row.questionId.toString(),
				board: row.board,
				content: row.content,
				timePosted: row.timePosted,
				liked: false,
				likes: 0,
				reported: false,
				reports: 0,
			}
			return answer
		},

		async archiveAnswer(
				{access: {user: {userId}}, checker, questionsTables},
				inputs: {archive: boolean, answerId: string},
			) {
			const {archive, answerId: answerIdString} = runValidation(
				inputs,
				schema({
					archive: boolean(),
					answerId: validateId,
				}),
			)
			const answerId = DamnId.fromString(answerIdString)
			const answerPost = await questionsTables.answerPosts.one(find({answerId}))
			requireUserCanEditAnswer({userId, checker, answerPost})
			await questionsTables.answerPosts.update({
				...find({answerId}),
				write: {archive},
			})
		},

		async likeAnswer(
				{questionsTables, checker, access: {user: {userId: userIdString}}},
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
				userId: DamnId.fromString(userIdString),
				itemId: DamnId.fromString(answerIdString),
			})
		},

		async reportAnswer(
				{questionsTables, checker, access: {user: {userId: userIdString}}},
				inputs: {report: boolean, answerId: string},
			) {
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
				userId: DamnId.fromString(userIdString),
				itemId: DamnId.fromString(answerIdString),
			})
		},
	},
})
