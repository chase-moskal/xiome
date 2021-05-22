
import styles from "./xiome-questions.css.js"
import {renderQuestion} from "./parts/render-question.js"
import {QuestionsModel} from "../model/types/questions-model.js"
import {QuestionsBoardModel} from "../model/types/board-model.js"
import {renderOp} from "../../../framework/op-rendering/render-op.js"
import {ModalSystem} from "../../../assembly/frontend/modal/types/modal-system.js"
import {Component2WithShare, mixinStyles, html, property} from "../../../framework/component2/component2.js"

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
		this.#boardModel = this.share.questionsModel.makeBoardModel(this.board)
		this.#boardModel.loadQuestions()
	}

	private renderQuestionsList() {
		const boardOp = this.#boardModel.getBoardOp()
		return renderOp(boardOp, () => {
			const questions = this.#boardModel.getQuestions()
			return html`
				<ol>
					${questions.map(question => {
						const author = this.#boardModel.getUser(question.authorUserId)
						return renderQuestion({author, question})
					})}
				</ol>
			`
		})
	}

	private renderQuestionsBoard() {
		const accessOp = this.#boardModel.getAccess()
		return renderOp(accessOp, () => html`
			${this.renderQuestionsList()}
		`)
	}

	render() {
		return this.#boardModel
			? this.renderQuestionsBoard()
			: null
	}
}
