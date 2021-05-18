
import styles from "./xiome-questions.css.js"
import {QuestionsModel} from "../model/types/questions-model.js"
import {QuestionsBoardModel} from "../model/types/board-model.js"
import {ModalSystem} from "../../../assembly/frontend/modal/types/modal-system.js"
import {Component2WithShare, mixinStyles, html, property} from "../../../framework/component2/component2.js"
import {renderOp} from "../../../framework/op-rendering/render-op.js"

@mixinStyles(styles)
export class XiomeQuestions extends Component2WithShare<{
		modals: ModalSystem
		questionsModel: QuestionsModel
	}> {

	#boardModel: QuestionsBoardModel

	@property({type: String, reflect: true})
	board: string = "default"

	@property({type: String})
	draftText: string = ""

	init() {
		console.log("INIT")
		this.#boardModel = this.share.questionsModel.makeBoardModel(this.board)
		this.#boardModel.loadQuestions()
	}

	// private renderQuestionsList() {
	// 	const boardOp = this.#boardModel.getBoardOp()
	// 	return renderOp(boardOp, () => {
	// 		const questions = this.#boardModel.getQuestions()
	// 		const {getUser, getAccess} = this.#boardModel
	// 		return html`
	// 			<ol>
	// 				${questions.map(question => html`
	// 					<li data-question-id="${question.questionId}">
	// 						${renderQuestion({
	// 							getUser,
	// 							question,
	// 							access: getAccess(),
	// 							handleLikeClick: () => console.log("like"),
	// 							handleUnlikeClick: () => console.log("unlike"),
	// 							handleDeleteClick: () => console.log("delete"),
	// 						})}
	// 					</li>
	// 				`)}
	// 			</ol>
	// 		`
	// 	})
	// }

	private renderQuestionsBoard() {
		const accessOp = this.#boardModel.getAccess()
		return renderOp(accessOp, access => html`
			questions
		`)
	}

	render() {
		return this.#boardModel
			? this.renderQuestionsBoard()
			: null
	}
}
