
import {User} from "../../auth/types/user.js"
import {merge} from "../../../toolbox/merge.js"
import {Op, ops} from "../../../framework/ops.js"
import {Question} from "../api/types/question.js"
import {QuestionDraft} from "../api/types/question-draft.js"
import {happystate} from "../../../toolbox/happystate/happystate.js"
import {AccessPayload} from "../../auth/types/tokens/access-payload.js"
import {GetBusiness} from "../../../framework/api/types/get-business.js"
import {questionsReadingParts} from "../api/services/questions-reading-parts.js"
import {questionsPostingParts} from "../api/services/questions-posting-parts.js"
import {questionsModerationParts} from "../api/services/questions-moderation-parts.js"
import {appPermissions} from "../../../assembly/backend/permissions2/standard-permissions.js"

export function makeQuestionsModel({
		questionsReadingService,
		questionsPostingService,
		questionsModerationService,
		getAccess,
	}: {
		questionsReadingService: GetBusiness<typeof questionsReadingParts>
		questionsPostingService: GetBusiness<typeof questionsPostingParts>
		questionsModerationService: GetBusiness<typeof questionsModerationParts>
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
					newUsers,
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
				}
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

			async likeQuestion(questionId: string, like: boolean) {
				await questionsPostingService.likeQuestion({
					like,
					questionId,
				})
				actions.setQuestionLike(questionId, like)
			},

			async reportQuestion(questionId: string, report: boolean) {
				await questionsPostingService.reportQuestion({
					report,
					questionId,
				})
				actions.setQuestionReport(questionId, report)
			},

			async archiveQuestion(questionId: string, archive: boolean) {
				await questionsPostingService.archiveQuestion({
					archive,
					questionId,
				})
				actions.setQuestionArchive(questionId, archive)
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
