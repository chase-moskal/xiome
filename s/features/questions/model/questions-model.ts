
import {merge} from "../../../toolbox/merge.js"
import {Op, ops} from "../../../framework/ops.js"
import {Service} from "../../../types/service.js"
import {User} from "../../auth/aspects/users/types/user.js"
import {QuestionDraft} from "../api/types/question-draft.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {AnswerDraft} from "../api/types/answer-draft.js"
import {happystate} from "../../../toolbox/happystate/happystate.js"
import {Answer, Question} from "../api/types/questions-and-answers.js"
import {makeQuestionsReadingService} from "../api/services/questions-reading-service.js"
import {makeQuestionsPostingService} from "../api/services/questions-posting-service.js"
import {appPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"
import {makeQuestionsAnsweringService} from "../api/services/questions-answering-service.js"
import {makeQuestionsModerationService} from "../api/services/questions-moderation-service.js"

export function makeQuestionsModel({
		questionsReadingService,
		questionsPostingService,
		questionsAnsweringService,
		questionsModerationService,
		getAccess,
	}: {
		questionsReadingService: Service<typeof makeQuestionsReadingService>
		questionsPostingService: Service<typeof makeQuestionsPostingService>
		questionsAnsweringService: Service<typeof makeQuestionsAnsweringService>
		questionsModerationService: Service<typeof makeQuestionsModerationService>
		getAccess: () => Op<AccessPayload>
	}) {

	const {actions, getState, onStateChange} = happystate({
		state: {
			access: <AccessPayload>undefined,
			users: <User[]>[],
			questions: <Question[]>[],
			boardOps: <{[key: string]: Op<void>}>{},
			postingOp: <Op<void>>ops.ready(undefined),
		},
		actions: state => ({
			setAccess(access: AccessPayload) {
				state.access = access
			},
			setBoardOp(board: string, op: Op<void>) {
				state.boardOps = {...state.boardOps, [board]: op}
			},
			setPostingOp(op: Op<void>) {
				state.postingOp = op
			},
			addUsers(newUsers: User[]) {
				state.users = [...merge<User>(
					newUsers.filter(u => !!u),
					state.users,
					(a, b) => a.userId === b.userId,
				)]
			},
			addQuestions(newQuestions: Question[]) {
				state.questions = [...merge<Question>(
					newQuestions,
					state.questions,
					(a, b) => a.questionId === b.questionId,
				)]
			},
			addAnswer(newAnswer: Answer) {
				const question = state.questions
					.find(q => q.questionId === newAnswer.questionId)
				if (!question)
					throw new Error(`can't find question to add answer, question id: "${newAnswer.questionId}"`)
				const newQuestion: Question = {
					...question,
					answers: [...question.answers, newAnswer],
				}
				state.questions = [...merge<Question>(
					[newQuestion],
					state.questions,
					(a, b) => a.questionId === b.questionId,
				)]
			},
			setQuestionLike(questionId: string, like: boolean) {
				state.questions = state.questions.map(question =>
					question.questionId === questionId
						? {
							...question,
							liked: like,
							likes: question.liked === like
								? question.likes
								: like
									? question.likes + 1
									: question.likes - 1
						}
						: {...question}
				)
			},
			setAnswerLike(questionId: string, answerId: string, status: boolean) {
				state.questions = state.questions.map(question =>
					question.questionId === questionId
						? {
							...question,
							answers: question.answers.map(answer =>
								answer.answerId === answerId
									? {
										...answer,
										liked: status,
										likes: answer.liked === status
											? answer.likes
											: status
												? answer.likes + 1
												: answer.likes - 1
									}
									: {...answer}
							)
						}
						: {...question}
				)
			},
			setAnswerReport(questionId: string, answerId: string, status: boolean) {
				state.questions = state.questions.map(question =>
					question.questionId === questionId
						? {
							...question,
							answers: question.answers.map(answer =>
								answer.answerId === answerId
									? {
										...answer,
										reported: status,
										reports: answer.reported === status
											? answer.reports
											: status
												? answer.reports + 1
												: answer.reports - 1
									}
									: {...answer}
							)
						}
						: {...question}
				)
			},
			setQuestionReport(questionId: string, report: boolean) {
				state.questions = state.questions.map(question =>
					question.questionId === questionId
						? {
							...question,
							reported: report,
							reports: question.reported === report
								? question.reports
								: report
									? question.reports + 1
									: question.reports - 1
						}
						: {...question}
				)
			},
			setQuestionArchive(questionId: string, archive: boolean) {
				state.questions = state.questions.map(question =>
					question.questionId === questionId
						? {...question, archive}
						: {...question}
				)
			},
			setAnswerArchive(questionId: string, answerId: string, archive: boolean) {
				state.questions = state.questions.map(question =>
					question.questionId === questionId
						? {
							...question,
							answers: question.answers.map(answer =>
								answer.answerId === answerId
									? {...answer, archive}
									: {...answer}
							)
						}
						: {...question}
				)
			},
		}),
	})

	async function loadQuestionsForBoard(board: string) {
		await ops.operation({
			promise: (async() => {
				const {users, questions} = await questionsReadingService
					.fetchQuestions({board})
				actions.addUsers(users)
				actions.addQuestions(questions)
			})(),
			setOp: op => actions.setBoardOp(board, op),
		})
	}

	function makeBoardModel(board: string) {
		return {

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
		}
	}

	async function refreshAllBoards() {
		const state = getState()
		await Promise.all(Object.keys(state.boardOps).map(loadQuestionsForBoard))
	}

	return {
		onStateChange,
		makeBoardModel,
		accessChange: (access: AccessPayload) => {
			actions.setAccess(access)
			if (access?.user)
				actions.addUsers([access.user])
			refreshAllBoards()
		},
	}
}
