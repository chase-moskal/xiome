
import {ops} from "../../../../framework/ops.js"
import {AnswerDraft} from "../../api/types/answer-draft.js"
import {QuestionDraft} from "../../api/types/question-draft.js"
import {makeQuestionsModelHappy} from "./questions-model-happy.js"
import {QuestionsModelOptions} from "../types/questions-model-options.js"
import {appPermissions} from "../../../../assembly/backend/permissions/standard-permissions.js"

export function prepareQuestionsBoardModelGetter({
		happy,
		questionsPostingService,
		questionsAnsweringService,
		questionsModerationService,
		getAccess,
		loadQuestionsForBoard,
	}: {
		happy: ReturnType<typeof makeQuestionsModelHappy>
		loadQuestionsForBoard: (board: string) => Promise<void>
	} & QuestionsModelOptions) {

	const {actions, getState} = happy

	return (board: string) => ({

		getPermissions() {
			const {access} = getState()
			return {
				"read questions":
					access
						? access.permit.privileges.includes(
							appPermissions.privileges["read questions"]
						)
						: false,
				"post questions":
					access
						? access.permit.privileges.includes(
							appPermissions.privileges["post questions"]
						) && !access.permit.privileges.includes(
							appPermissions.privileges["banned"]
						)
						: false,
				"moderate questions":
					access
						? access.permit.privileges.includes(
							appPermissions.privileges["moderate questions"]
						)
						: false,
				"answer questions":
					access
						? access.permit.privileges.includes(
							appPermissions.privileges["answer questions"]
						)
						: false
			} as const
		},

		getBoardName() {
			return board
		},

		getAccess() {
			return getState().access
		},

		getBoardOp() {
			return getState().boardOps[board]
		},

		getPostingOp() {
			return getState().postingOp
		},

		getQuestions() {
			return getState().questions
				.filter(question => question.board === board)
				.filter(question => question.archive === false)
				.map(question => ({
					...question,
					answers: question.answers
						.filter(answer => answer.archive === false)
				}))
		},

		getUser(userId: string) {
			return getState().users.find(user => user.userId === userId)
		},

		async loadQuestions() {
			await loadQuestionsForBoard(board)
		},

		async postQuestion(questionDraft: QuestionDraft) {
			const question = await ops.operation({
				promise: questionsPostingService.postQuestion({questionDraft}),
				setOp: op => actions.setPostingOp(
					ops.replaceValue(op, undefined)
				),
			})
			actions.addQuestions([question])
			const access = ops.value(getAccess())
			actions.addUsers([access.user])
		},

		async postAnswer(questionId: string, answerDraft: AnswerDraft) {
			const answer = await ops.operation({
				promise: questionsAnsweringService.postAnswer({
					questionId,
					answerDraft,
				}),
				setOp: op => actions.setPostingOp(
					ops.replaceValue(op, undefined)
				),
			})
			actions.addAnswer(answer)
			const access = ops.value(getAccess())
			actions.addUsers([access.user])
		},

		async likeQuestion(questionId: string, like: boolean) {
			await questionsPostingService.likeQuestion({
				like: like,
				questionId,
			})
			actions.setQuestionLike(questionId, like)
		},

		async likeAnswer(questionId: string, answerId: string, like: boolean) {
			await questionsAnsweringService.likeAnswer({answerId, like})
			actions.setAnswerLike(questionId, answerId, like)
		},

		async reportQuestion(questionId: string, report: boolean) {
			await questionsPostingService.reportQuestion({
				report,
				questionId,
			})
			actions.setQuestionReport(questionId, report)
		},

		async reportAnswer(questionId: string, answerId: string, report: boolean) {
			await questionsAnsweringService.reportAnswer({answerId, report})
			actions.setAnswerReport(questionId, answerId, report)
		},

		async archiveQuestion(questionId: string, archive: boolean) {
			await questionsPostingService.archiveQuestion({
				archive,
				questionId,
			})
			actions.setQuestionArchive(questionId, archive)
		},

		async archiveAnswer(questionId: string, answerId: string, archive: boolean) {
			await questionsAnsweringService.archiveAnswer({answerId, archive})
			actions.setAnswerArchive(questionId, answerId, archive)
		},

		async archiveBoard() {
			await questionsModerationService.archiveBoard({board})
			for (const question of getState().questions)
				actions.setQuestionArchive(question.questionId, true)
		},
	})
}
