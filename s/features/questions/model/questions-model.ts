
import {User} from "../../auth/types/user.js"
import {merge} from "../../../toolbox/merge.js"
import {Service} from "../../../types/service.js"
import {Op, ops} from "../../../framework/ops.js"
import {Question} from "../topics/types/question.js"
import {QuestionDraft} from "../topics/types/question-draft.js"
import {happystate} from "../../../toolbox/happystate/happystate.js"
import {AccessPayload} from "../../auth/types/tokens/access-payload.js"
import {questionPostingTopic} from "../topics/question-posting-topic.js"
import {questionReadingTopic} from "../topics/question-reading-topic.js"
import {questionModerationTopic} from "../topics/question-moderation-topic.js"
import {appPermissions} from "../../../assembly/backend/permissions2/standard-permissions.js"

export function makeQuestionsModel({
		questionPostingService,
		questionReadingService,
		questionModerationService,
		getAccess,
	}: {
		questionPostingService: Service<typeof questionPostingTopic>
		questionReadingService: Service<typeof questionReadingTopic>
		questionModerationService: Service<typeof questionModerationTopic>
		getAccess: () => Op<AccessPayload>
	}) {

	const happy = happystate({
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
			setQuestionArchive(questionId: string, archive: boolean) {
				state.questions = state.questions.map(question =>
					question.questionId === questionId
						? {...question, archive}
						: {...question}
				)
			},
		}),
	})

	function makeBoardModel(board: string) {
		return {

			getPermissions() {
				const {access} = happy.state
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
				return happy.state.access
			},

			getBoardOp() {
				return happy.state.boardOps[board]
			},

			getPostingOp() {
				return happy.state.postingOp
			},

			getQuestions() {
				return happy.state.questions
					.filter(question => question.board === board)
					.filter(question => question.archive === false)
			},

			getUser(userId: string) {
				return happy.state.users.find(user => user.userId === userId)
			},

			async loadQuestions() {
				await ops.operation({
					promise: (async() => {
						const {users, questions} = await questionReadingService
							.fetchQuestions({board})
						happy.actions.addUsers(users)
						happy.actions.addQuestions(questions)
					})(),
					setOp: op => happy.actions.setBoardOp(board, op),
				})
			},

			async postQuestion(questionDraft: QuestionDraft) {
				const question = await ops.operation({
					promise: questionPostingService.postQuestion({questionDraft}),
					setOp: op => happy.actions.setPostingOp(
						ops.replaceValue(op, undefined)
					),
				})
				happy.actions.addQuestions([question])
				const access = ops.value(getAccess())
				happy.actions.addUsers([access.user])
			},

			async likeQuestion(questionId: string, like: boolean) {
				await questionPostingService.likeQuestion({
					like,
					questionId,
				})
				happy.actions.setQuestionLike(questionId, like)
			},

			async archiveQuestion(questionId: string, archive: boolean) {
				await questionPostingService.archiveQuestion({
					archive,
					questionId,
				})
				happy.actions.setQuestionArchive(questionId, archive)
			},

			async archiveBoard() {
				await questionModerationService.archiveBoard({board})
				for (const question of happy.state.questions)
					happy.actions.setQuestionArchive(question.questionId, true)
			},
		}
	}

	return {
		happy,
		makeBoardModel,
		accessChange: (access: AccessPayload) => {
			happy.actions.setAccess(access)
			if (access.user) {
				happy.actions.addUsers([access.user])
			}
		},
	}
}
