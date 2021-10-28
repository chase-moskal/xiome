
import {ApiError} from "renraku/x/api/api-error.js"
import {apiContext} from "renraku/x/api/api-context.js"

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
import {QuestionsUserAuth} from "../types/questions-metas-and-auths.js"
import {validateQuestionDraft} from "./validation/validate-question-draft.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"
import {requireUserCanEditQuestion} from "./helpers/require-user-can-edit-question.js"
import {validateId} from "../../../../common/validators/validate-id.js"
import {authenticatedQuestionsPolicy} from "./policies/authenticated-questions-policy.js"

export const makeQuestionsPostingService = (
		options: QuestionsApiOptions
	) => apiContext<UserMeta, QuestionsUserAuth>()({

	policy: async(meta, request) => {
		const auth = await authenticatedQuestionsPolicy(options)(meta, request)
		auth.checker.requireNotHavePrivilege("banned")

		const canPostQuestions = auth.checker.hasPrivilege("post questions")
		const isModerator = auth.checker.hasPrivilege("moderate questions")
		const allowed = canPostQuestions || isModerator
		if (!allowed)
			throw new ApiError(403, "not allowed to post questions")

		return auth
	},

	expose: {

		async postQuestion(
				{access, questionsTables},
				inputs: {questionDraft: QuestionDraft},
			): Promise<Question> {
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

		async archiveQuestion(
				{access: {user: {userId}}, questionsTables, checker},
				inputs: {archive: boolean, questionId: string}
			) {
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
			requireUserCanEditQuestion({userId, checker, questionPost})
			await questionsTables.questionPosts.update({
				...find({questionId}),
				write: {archive: !!archive},
			})
		},

		async likeQuestion(
				{questionsTables, checker, access: {user: {userId: userIdString}}},
				inputs: {like: boolean, questionId: string}
			) {
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
				userId: DamnId.fromString(userIdString),
				itemId: DamnId.fromString(questionIdString),
			})
		},

		async reportQuestion(
				{questionsTables, checker, access: {user: {userId: userIdString}}},
				inputs: {report: boolean, questionId: string},
			) {
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
				userId: DamnId.fromString(userIdString),
				itemId: DamnId.fromString(questionIdString),
			})
		},
	},
})
