
import styles from "./xiome-questions.css.js"
import {renderPost} from "./parts/post/render-post.js"
import {sortQuestions} from "./helpers/sort-questions.js"
import {Question} from "../api/types/questions-and-answers.js"
import {QuestionsModel} from "../model/types/questions-model.js"
import {QuestionsBoardModel} from "../model/types/board-model.js"
import {weakRecordKeeper} from "../../../toolbox/record-keeper.js"
import {renderOp} from "../../../framework/op-rendering/render-op.js"
import {XioTextInput} from "../../xio-components/inputs/xio-text-input.js"
import {PressEvent} from "../../xio-components/button/events/press-event.js"
import {ModalSystem} from "../../../assembly/frontend/modal/types/modal-system.js"
import {ValueChangeEvent} from "../../xio-components/inputs/events/value-change-event.js"
import {mixinStyles, html, property, query, ComponentWithShare} from "../../../framework/component/component.js"
import {happystate} from "../../../toolbox/happystate/happystate.js"
import {PostType} from "./parts/post/types/post-options.js"


@mixinStyles(styles)
export class XiomeQuestions extends ComponentWithShare<{
		modals: ModalSystem
		questionsModel: QuestionsModel
	}> {

	#boardModel: QuestionsBoardModel

	#now = Date.now()
	#updateNowInterval: NodeJS.Timer
	connectedCallback() {
		super.connectedCallback()
		this.#updateNowInterval = setInterval(() => {
			this.#now = Date.now()
			this.requestUpdate()
		}, 1000)
	}
	disconnectedCallback() {
		clearInterval(this.#updateNowInterval)
		super.disconnectedCallback()
	}

	@property({type: String, reflect: true})
	board: string = "default"

	@property({type: String})
	draftText: string = ""

	@query(".question-editor xio-text-input")
	editorTextInput: XioTextInput

	get postable() {
		return !!this.draftText
	}

	init() {
		this.#boardModel = this.share.questionsModel.makeBoardModel(this.board)
		this.#boardModel.loadQuestions()
	}

	private handlePost = async() => {
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
		const author = access?.user
		return permissions["post questions"]
			? renderOp(
				this.#boardModel.getPostingOp(),
				() => html`
					<div class=question-editor>
						<div class=intro>
							<p class=heading>Post a new question</p>
						</div>
						${renderPost({
							type: PostType.Editor,
							author,
							content: this.draftText,
							isPostable: this.postable,
							timePosted: this.#now,
							submitPost: this.handlePost,
							changeDraftContent: this.handleValueChange,
						})}
					</div>
				`
			)
			: null
	}

	#getAnswerEditorState = weakRecordKeeper<Question>()(question => {
		const state = {
			editMode: false,
			draftText: "",
			isPostable: () => !!state.draftText,
			handlePost: () => {
				console.log("POST LOL")
			},
			handleValueChange: (event: ValueChangeEvent<string>) => {
				state.draftText = event.detail.value
				this.requestUpdate()
			},
			toggleAnswerEditMode: () => {
				state.editMode = !state.editMode
				this.requestUpdate()
			},
		}
		return state
	})

	private renderQuestionsList() {
		const access = this.#boardModel.getAccess()
		const myUser = access?.user
		const questions = sortQuestions(this.#boardModel.getQuestions(), myUser?.userId)
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

					const answerEditorState = this.#getAnswerEditorState(question)

					return html`
						<li class=question data-question-id="${question.questionId}">
							${renderPost({
								type: PostType.Question,
								author,
								content: question.content,
								deletePost: handleDelete,
								liking: {
									liked: question.liked,
									likes: question.likes,
									castLikeVote: handleLike,
								},
								postId: question.questionId,
								reporting: {
									reported: question.reported,
									reports: question.reports,
									castReportVote: handleReport,
								},
								timePosted: question.timePosted,
								toggleAnswerEditor: answerEditorState.toggleAnswerEditMode,
							})}
							${answerEditorState.editMode
								? html`
									<p>answer editor</p>
									${renderPost({
										author,
										type: PostType.Editor,
										timePosted: this.#now,
										content: answerEditorState.draftText,
										isPostable: answerEditorState.isPostable(),
										submitPost: () => console.log("SUBMIT ANSWER"),
										changeDraftContent: answerEditorState.handleValueChange,
									})}
								`
								: null}
						</li>
					`
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
