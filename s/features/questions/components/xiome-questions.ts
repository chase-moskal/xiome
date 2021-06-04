
import styles from "./xiome-questions.css.js"
import {sortQuestions} from "./helpers/sort-questions.js"
import {renderQuestion} from "./parts/render-question.js"
import {QuestionsModel} from "../model/types/questions-model.js"
import {QuestionsBoardModel} from "../model/types/board-model.js"
import {renderOp} from "../../../framework/op-rendering/render-op.js"
import {renderQuestionEditor} from "./parts/render-question-editor.js"
import {XioTextInput} from "../../xio-components/inputs/xio-text-input.js"
import {PressEvent} from "../../xio-components/button/events/press-event.js"
import {ModalSystem} from "../../../assembly/frontend/modal/types/modal-system.js"
import {ValueChangeEvent} from "../../xio-components/inputs/events/value-change-event.js"
import {Component2WithShare, mixinStyles, html, property, query} from "../../../framework/component2/component2.js"

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

	@query(".question-editor .question-body xio-text-input")
	editorTextInput: XioTextInput

	get postable() {
		return !!this.draftText
	}

	init() {
		this.#boardModel = this.share.questionsModel.makeBoardModel(this.board)
		this.#boardModel.loadQuestions()
	}

	private handlePost = async(event: PressEvent) => {
		const content = this.draftText
		this.editorTextInput.text = ""
		await this.#boardModel.postQuestion({
			content,
			board: this.#boardModel.getBoardName(),
		})
	}

	private handleValueChange = (event: ValueChangeEvent<string>) => {
		this.draftText = event.detail.value
	}

	private renderEditor() {
		const access = this.#boardModel.getAccess()
		const permissions = this.#boardModel.getPermissions()
		const questionAuthor = access?.user

		return permissions["post questions"]
			? renderOp(
				this.#boardModel.getPostingOp(),
				() => renderQuestionEditor({
					questionAuthor,
					content: this.draftText,
					postable: this.postable,
					handlePost: this.handlePost,
					handleValueChange: this.handleValueChange,
				})
			)
			: null
	}

	private renderQuestionsList() {
		const access = this.#boardModel.getAccess()
		const myUserId = access?.user?.userId
		const questions = sortQuestions(this.#boardModel.getQuestions(), myUserId)
		const permissions = this.#boardModel.getPermissions()

		return html`
			<ol class=questionslist>
				${questions.map(question => {
					const {questionId, authorUserId} = question
					const author = this.#boardModel.getUser(authorUserId)

					const isAuthor = (access && access.user)
						? access.user.userId === author.userId
						: false

					const authority = permissions["moderate questions"] || isAuthor

					const handleDelete = () => {
						this.#boardModel.archiveQuestion(questionId, true)
					}

					const handleLike = (like: boolean) => {
						this.#boardModel.likeQuestion(questionId, like)
					}

					const handleReport = (report: boolean) => {
						this.#boardModel.reportQuestion(questionId, report)
					}

					return renderQuestion({
						author,
						authority,
						question,
						handleDelete,
						handleLike,
						handleReport,
					})
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
