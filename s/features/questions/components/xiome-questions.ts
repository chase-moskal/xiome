
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
import {ValueChangeEvent} from "../../xio-components/inputs/events/value-change-event.js"
import {PressEvent} from "../../xio-components/button/events/press-event.js"

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

	get postable() {
		return !!this.draftText
	}

	init() {
		this.share.questionsModel.happy.subscribe(() => {
			this.requestUpdate()
		})
		this.#boardModel = this.share.questionsModel.makeBoardModel(this.board)
		this.#boardModel.loadQuestions()
	}

	private handlePost = (event: PressEvent) => {
		console.log("POST", this.draftText)
	}

	private handleValueChange = (event: ValueChangeEvent<string>) => {
		this.draftText = event.detail.value
	}

	private renderEditor() {
		const access = this.#boardModel.getAccess()
		const questionAuthor = access?.user
		const {privileges} = access.permit

		const allowedToPostQuestions = privileges.includes(
			appPermissions.privileges["post questions"]
		)

		return allowedToPostQuestions
			? renderQuestionEditor({
				questionAuthor,
				postable: this.postable,
				handlePost: this.handlePost,
				handleValueChange: this.handleValueChange,
			})
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
		return this.#boardModel && this.#boardModel.getBoardOp()
			? this.renderQuestionsBoard()
			: null
	}
}
