
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

	private renderQuestionsModerationPanel() {
		const permissions = this.#boardModel.getPermissions()
		const board = this.#boardModel.getBoardName()
		const handlePressPurgeButton = async() => {
			const confirmed = await this.share.modals.confirm({
				title: `Purge questions?`,
				body: `Are you sure you want to delete all the questions on the board "${board}"? This cannot be undone.`,
				yes: {vibe: "negative", label: "Purge all"},
				no: {vibe: "neutral", label: "Nevermind"},
				focusNthElement: 2,
			})
			if (confirmed)
				await this.#boardModel.archiveBoard()
		}
		return permissions["moderate questions"]
			? html`
				<div class=questions-moderation-panel>
					<h3>moderate questions board "${this.board}"</h3>
					<xio-button
						class=purge-button
						@press=${handlePressPurgeButton}>
							Purge all questions
					</xio-button>
				</div>
			`
			: null
	}

	private renderQuestionsEditor() {
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

					const handleDelete = async() => {
						const confirmed = await this.share.modals.confirm({
							title: "Delete question?",
							body: "Are you sure you want to delete this question? This cannot be undone.",
							yes: {vibe: "negative", label: "Delete question"},
							no: {vibe: "neutral", label: "Nevermind"},
							focusNthElement: 2,
						})
						if (confirmed)
							await this.#boardModel.archiveQuestion(questionId, true)
					}

					const handleLike = (like: boolean) => {
						this.#boardModel.likeQuestion(questionId, like)
					}

					const handleReport = async(report: boolean) => {
						const confirmed = report
							? await this.share.modals.confirm({
								title: "Report question?",
								body: "Are you sure you want to submit a report against this question?",
								yes: {vibe: "negative", label: "Submit report"},
								no: {vibe: "neutral", label: "Nevermind"},
								focusNthElement: 2,
							})
							: true
						if (confirmed)
							await this.#boardModel.reportQuestion(questionId, report)
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
		const numberOfQuestions = this.#boardModel.getQuestions().length
		return renderOp(boardOp, () => html`
			${this.renderQuestionsModerationPanel()}
			${this.renderQuestionsEditor()}
			${numberOfQuestions > 0
				? this.renderQuestionsList()
				: html`<slot name=empty><p>Be the first to post a question!</p></slot>`}
		`)
	}

	render() {
		return this.#boardModel && this.#boardModel.getBoardOp()
			? this.renderQuestionsBoard()
			: null
	}
}
