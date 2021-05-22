
import styles from "./xiome-questions.css.js"
import {ops} from "../../../framework/ops.js"
import {renderQuestion} from "./parts/render-question.js"
import {QuestionsModel} from "../model/types/questions-model.js"
import {QuestionsBoardModel} from "../model/types/board-model.js"
import {renderOp} from "../../../framework/op-rendering/render-op.js"
import {renderQuestionEditor} from "./parts/render-question-editor.js"
import {ModalSystem} from "../../../assembly/frontend/modal/types/modal-system.js"
import {appPermissions} from "../../../assembly/backend/permissions2/standard-permissions.js"
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

	private renderEditor() {
		const access = this.#boardModel.getAccess()
		const questionAuthor = access?.user
		const {privileges} = access.permit

		const allowedToPostQuestions = privileges.includes(
			appPermissions.privileges["post questions"]
		)

		return allowedToPostQuestions
			? renderQuestionEditor({questionAuthor})
			: null
	}

	private renderQuestionsList() {
		const questions = this.#boardModel.getQuestions()
		return html`
			<ol>
				${questions.map(question => {
					const author = this.#boardModel.getUser(question.authorUserId)
					return renderQuestion({author, question})
				})}
			</ol>
		`
	}

	private renderQuestionsBoard() {
		const boardOp = this.#boardModel.getBoardOp()
		return renderOp(boardOp, () => html`
			${this.renderEditor()}
			${this.renderQuestionsList()}
		`)
	}

	render() {
		console.log("RENDER", this.#boardModel)
		return this.#boardModel
			? this.renderQuestionsBoard()
			: null
	}
}
