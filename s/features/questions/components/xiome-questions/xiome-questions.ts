
import styles from "./xiome-questions.css.js"
import {sortQuestions} from "./helpers/sort-questions.js"
import {renderQuestion} from "./parts/render-question.js"
import {QuestionsModel} from "../../model/types/questions-model.js"
import {QuestionsBoardModel} from "../../model/types/board-model.js"
import {makeQuestionEditor} from "./parts/editors/question-editor.js"
import {makeAnswerEditorGetter} from "./parts/editors/answer-editor.js"
import {renderModerationPanel} from "./parts/render-moderation-panel.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {renderQuestionEditor} from "./parts/editors/render-question-editor.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {mixinStyles, mixinTicker, html, property, Component, mixinRequireShare} from "../../../../framework/component.js"

@mixinStyles(styles)
export class XiomeQuestions extends
	mixinTicker(1000)(
		mixinRequireShare<{
				modals: ModalSystem
				questionsModel: QuestionsModel
			}>()(
			Component
		)
	) {

	#boardModel: QuestionsBoardModel

	#questionEditor = makeQuestionEditor({
		getBoardModel: () => this.#boardModel,
		requestUpdate: () => this.requestUpdate(),
		getTextInput: () => (
			this.shadowRoot.querySelector(".question-editor xio-text-input")
		),
	})

	#getAnswerEditor = makeAnswerEditorGetter({
		getBoardModel: () => this.#boardModel,
		requestUpdate: () => this.requestUpdate(),
		getTextInput: (questionId: string) => (
			this.shadowRoot.querySelector(
				`[part="questions-list"] li[data-question-id="${questionId}"] xio-text-input`
			)
		),
	})

	#now = Date.now()

	tick() {
		this.#now = Date.now()
	}

	@property({type: String, reflect: true})
	board: string = "default"

	init() {
		this.#boardModel = this.share.questionsModel.makeBoardModel(this.board)
		this.#boardModel.loadQuestions()
	}

	private renderQuestionsBoard() {
		const now = this.#now
		const {modals} = this.share
		const questionEditor = this.#questionEditor
	
		const {archiveBoard} = this.#boardModel
		const access = this.#boardModel.getAccess()
		const board = this.#boardModel.getBoardName()
		const boardOp = this.#boardModel.getBoardOp()
		const postingOp = this.#boardModel.getPostingOp()
		const permissions = this.#boardModel.getPermissions()
		const questions = sortQuestions(
			this.#boardModel.getQuestions(),
			access?.user?.userId,
		)

		return renderOp(boardOp, () => html`

			${permissions["moderate questions"]
				? renderModerationPanel({modals, board, archiveBoard})
				: null}

			${permissions["post questions"]
				? renderQuestionEditor({now, access, postingOp, questionEditor})
				: null}

			${questions.length > 0
				? html`
					<ol part=questions-list>
						${questions.map(question => html`
							<li data-question-id="${question.questionId}">
								${renderQuestion({
									question,
									now: this.#now,
									modals: this.share.modals,
									boardModel: this.#boardModel,
									answerEditor: this.#getAnswerEditor(question.questionId),
								})}
							</li>
						`)}
					</ol>
				`
				: html`<slot name=empty><p>Be the first to post a question!</p></slot>`}
		`)
	}

	render() {
		return this.#boardModel && this.#boardModel.getBoardOp()
			? this.renderQuestionsBoard()
			: null
	}
}
