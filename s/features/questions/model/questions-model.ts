
import {merge} from "../../../toolbox/merge.js"
import {User} from "../../auth/types/user.js"
import {Service} from "../../../types/service.js"
import {Op, ops} from "../../../framework/ops.js"
import {Question} from "../topics/types/question.js"
import {QuestionDraft} from "../topics/types/question-draft.js"
import {autowatcher} from "../../../toolbox/autowatcher/autowatcher.js"
import {AccessPayload} from "../../auth/types/tokens/access-payload.js"
import {questionPostingTopic} from "../topics/question-posting-topic.js"
import {questionReadingTopic} from "../topics/question-reading-topic.js"
import {questionModerationTopic} from "../topics/question-moderation-topic.js"

export function makeQuestionsModel({
		questionPostingService,
		questionReadingService,
		questionModerationService,
		getAccess,
	}: {
		questionPostingService: Service<typeof questionPostingTopic>
		questionReadingService: Service<typeof questionReadingTopic>
		questionModerationService: Service<typeof questionModerationTopic>
		getAccess: () => AccessPayload
	}) {

	const watcher = autowatcher()

	const state = watcher.state({
		users: <User[]>[],
		questions: <Question[]>[],
		boardOps: <{[key: string]: Op<void>}>{},
	})

	const actions = watcher.actions({
		setBoardOp(board: string, op: Op<void>) {
			state.boardOps = {...state.boardOps, [board]: op}
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
	})

	function makeBoardModel(board: string) {
		return {

			getAccess,

			getBoardOp() {
				return state.boardOps[board]
			},

			getQuestions() {
				return state.questions.filter(question => question.board === board)
			},

			getUser(userId: string) {
				return state.users.find(user => user.userId === userId)
			},

			async loadQuestions() {
				await ops.operation({
					promise: (async() => {
						const {users, questions} = await questionReadingService
							.fetchQuestions({board})
						actions.addUsers(users)
						actions.addQuestions(questions)
					})(),
					setOp: op => actions.setBoardOp(board, op),
				})
			},

			async postQuestion(questionDraft: QuestionDraft) {
				const question = await questionPostingService
					.postQuestion({questionDraft})
				actions.addQuestions([question])
				actions.addUsers([getAccess().user])
			},

			async likeQuestion(questionId: string, like: boolean) {
				await questionPostingService.likeQuestion({
					like,
					questionId,
				})
				actions.setQuestionLike(questionId, like)
			},

			async archiveQuestion(questionId: string, archive: boolean) {
				await questionPostingService.archiveQuestion({
					archive,
					questionId,
				})
				actions.setQuestionArchive(questionId, archive)
			},

			async archiveBoard() {
				await questionModerationService.archiveBoard({board})
				for (const question of state.questions)
					actions.setQuestionArchive(question.questionId, true)
			},
		}
	}

	return {makeBoardModel}
}
