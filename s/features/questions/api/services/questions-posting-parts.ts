
import {Question} from "../types/question.js"
import {QuestionDraft} from "../types/question-draft.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {UserMeta} from "../../../auth/policies/types/user-meta.js"
import {UserAuth} from "../../../auth/policies/types/user-auth.js"
import {QuestionPostRow} from "../tables/types/questions-tables.js"
import {QuestionsAuthParts} from "../types/questions-auth-parts.js"
import {QuestionsApiOptions} from "../types/questions-api-options.js"
import {asServiceParts} from "../../../../framework/api/as-service-parts.js"
import {validateQuestionDraft} from "./validation/validate-question-draft.js"
import {throwProblems} from "../../../../toolbox/topic-validation/throw-problems.js"
import {authenticatedQuestionsPolicy} from "./policies/authenticated-questions-policy.js"
import {requireUserCanEditQuestion} from "./authorizers/require-user-can-edit-question.js"
import {ApiError} from "renraku/x/api/api-error"

export const questionsPostingParts = (
		options: QuestionsApiOptions
	) => asServiceParts<
		UserMeta,
		QuestionsAuthParts & UserAuth
	>()({

	policy: async(meta, request) => {
		const auth = await authenticatedQuestionsPolicy(options)(meta, request)
		auth.checker.requirePrivilege("post questions")
		auth.checker.requireNotHavePrivilege("banned")
		return auth
	},

	expose: {

		async postQuestion(
				{questionsTables, access, checker},
				{questionDraft}: {questionDraft: QuestionDraft},
			): Promise<Question> {

			checker.requirePrivilege("post questions")
			throwProblems(validateQuestionDraft(questionDraft))

			const row: QuestionPostRow = {
				questionId: options.rando.randomId(),
				authorUserId: access.user.userId,
				archive: false,
				timePosted: Date.now(),
				...questionDraft,
			}

			await questionsTables.questionPosts.create(row)
			return {
				...row,
				likes: 0,
				reports: 0,
				liked: false,
				reported: false,
			}
		},

		async archiveQuestion(
				{access: {user: {userId}}, questionsTables, checker},
				{questionId, archive}: {
					archive: boolean
					questionId: string
				}
			) {

			const questionPost = await questionsTables.questionPosts
				.one(find({questionId}))

			requireUserCanEditQuestion({userId, checker, questionPost})

			await questionsTables.questionPosts.update({
				...find({questionId}),
				write: {archive: !!archive},
			})
		},

		async likeQuestion(
				{questionsTables, checker, access: {user: {userId}}},
				{questionId, like}: {
					questionId: string
					like: boolean
				}
			) {

			checker.requirePrivilege("like questions")

			const myLikeCount = await questionsTables.questionLikes
				.count(find({questionId, userId}))

			const alreadyLiked = myLikeCount > 0

			const addLike = () => questionsTables.questionLikes
				.create({userId, questionId})

			const removeLike = () => questionsTables.questionLikes
				.delete(find({userId, questionId}))

			if (like && !alreadyLiked)
				await addLike()

			else if (!like && alreadyLiked)
				await removeLike()
		},

		async reportQuestion(
				{questionsTables, checker, access: {user: {userId}}},
				{questionId, report}: {
					questionId: string
					report: boolean
				},
			) {

			checker.requirePrivilege("report questions")

			const myReportCount = await questionsTables.questionReports
				.count(find({questionId, userId}))

			const alreadyReported = myReportCount > 0

			const addReport = () => questionsTables.questionReports
				.create({userId, questionId})

			const removeReport = () => questionsTables.questionReports
				.delete(find({userId, questionId}))

			if (report && !alreadyReported)
				await addReport()

			else if (!report && alreadyReported)
				await removeReport()
		},
	},
})
