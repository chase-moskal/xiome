
import {ops} from "../../../framework/ops.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {QuestionsModelOptions} from "./types/questions-model-options.js"
import {makeQuestionsModelHappy} from "./parts/questions-model-state.js"
import {prepareQuestionsBoardModelGetter} from "./parts/questions-board-model.js"

export function makeQuestionsModel(options: QuestionsModelOptions) {
	const {questionsReadingService} = options
	const {state, actions, subscribe} = makeQuestionsModelHappy()

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

	async function refreshAllBoards() {
		await Promise.all(Object.keys(state.boardOps).map(loadQuestionsForBoard))
	}

	return {
		subscribe,
		makeBoardModel: prepareQuestionsBoardModelGetter({
			state,
			actions,
			loadQuestionsForBoard,
			...options,
		}),
		accessChange: (access: AccessPayload) => {
			actions.setAccess(access)
			if (access?.user)
				actions.addUsers([access.user])
			refreshAllBoards()
		},
	}
}
