
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
				id_question: options.rando.randomId(),
				authorUserId: access.user.id_user,
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
				{access: {user: {id_user}}, questionsTables, checker},
				{id_question, archive}: {
					archive: boolean
					id_question: string
				}
			) {

			const questionPost = await questionsTables.questionPosts
				.one(find({id_question}))

			requireUserCanEditQuestion({id_user, checker, questionPost})

			await questionsTables.questionPosts.update({
				...find({id_question}),
				write: {archive: !!archive},
			})
		},

		async likeQuestion(
				{questionsTables, checker, access: {user: {id_user}}},
				{id_question, like}: {
					id_question: string
					like: boolean
				}
			) {

			checker.requirePrivilege("like questions")

			const myLikeCount = await questionsTables.questionLikes
				.count(find({id_question, id_user}))

			const alreadyLiked = myLikeCount > 0

			const addLike = () => questionsTables.questionLikes
				.create({id_user, id_question})

			const removeLike = () => questionsTables.questionLikes
				.delete(find({id_user, id_question}))

			if (like && !alreadyLiked)
				await addLike()

			else if (!like && alreadyLiked)
				await removeLike()
		},

		async reportQuestion(
				{questionsTables, checker, access: {user: {id_user}}},
				{id_question, report}: {
					id_question: string
					report: boolean
				},
			) {

			checker.requirePrivilege("report questions")

			const myReportCount = await questionsTables.questionReports
				.count(find({id_question, id_user}))

			const alreadyReported = myReportCount > 0

			const addReport = () => questionsTables.questionReports
				.create({id_user, id_question})

			const removeReport = () => questionsTables.questionReports
				.delete(find({id_user, id_question}))

			if (report && !alreadyReported)
				await addReport()

			else if (!report && alreadyReported)
				await removeReport()
		},
	},
})
