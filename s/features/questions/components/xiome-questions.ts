
import styles from "./xiome-questions.css.js"
import {renderPost} from "./parts/post/render-post.js"
import {sortQuestions} from "./helpers/sort-questions.js"
import {PostType} from "./parts/post/types/post-options.js"
import {Answer} from "../api/types/questions-and-answers.js"
import {QuestionsModel} from "../model/types/questions-model.js"
import {QuestionsBoardModel} from "../model/types/board-model.js"
import {renderOp} from "../../../framework/op-rendering/render-op.js"
import {makeQuestionEditor} from "./parts/editors/question-editor.js"
import {makeAnswerEditorGetter} from "./parts/editors/answer-editor.js"
import {ModalSystem} from "../../../assembly/frontend/modal/types/modal-system.js"
import {mixinStyles, mixinTicker, html, property, ComponentWithShare} from "../../../framework/component/component.js"
import {renderModerationPanel} from "./parts/render-moderation-panel.js"
import {renderQuestionEditor} from "./parts/editors/render-question-editor.js"

@mixinTicker(1000)
class BaseComponent extends ComponentWithShare<{
	modals: ModalSystem
	questionsModel: QuestionsModel
}> {}

@mixinStyles(styles)
export class XiomeQuestions extends BaseComponent {
	#boardModel: QuestionsBoardModel
	#questionEditor = makeQuestionEditor({getBoardModel: () => this.#boardModel})
	#getAnswerEditor = makeAnswerEditorGetter({getBoardModel: () => this.#boardModel})
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

					const questionAuthorities = (() => {
						const isAuthor = (access && access.user)
							? access.user.userId === author.userId
							: false
						const canDelete = permissions["moderate questions"] || isAuthor
						const canAnswer = permissions["answer questions"]
						return {canDelete, canAnswer}
					})()

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

					const answerEditor = this.#getAnswerEditor(questionId)
					const answerEditorState = answerEditor.getState()

					const canDeleteAnswer = (answer: Answer) => {
						const isAuthor = access?.user?.userId === answer.authorUserId
						return permissions["moderate questions"] || isAuthor
					}

					return html`
						<li class=question data-question-id="${question.questionId}">
							${renderPost({
								type: PostType.Question,
								author,
								content: question.content,
								deletePost: questionAuthorities.canDelete
									? handleDelete
									: undefined,
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
								toggleAnswerEditor: questionAuthorities.canAnswer
									? answerEditor.actions.toggleEditMode
									: undefined,
							})}
							${answerEditorState.editMode
								? html`
									<div class="editor answer-editor">
										<div class=intro>
											<p class=heading>Post your answer</p>
										</div>
										${renderPost({
											author: this.#boardModel.getAccess().user,
											type: PostType.Editor,
											timePosted: this.#now,
											content: answerEditorState.draftText,
											isPostable: answerEditorState.isPostable,
											postButtonText: "post answer",
											submitPost: answerEditor.submitAnswer,
											changeDraftContent: answerEditor.actions.handleValueChange,
										})}
									</div>
								`
								: null}
							${question.answers.length ? html`
								<ol class=answers>
									${question.answers.map(answer => html`
										<li class=answer data-answer-id="${answer.answerId}">
											${renderPost({
												type: PostType.Answer,
												postId: answer.answerId,
												author: this.#boardModel.getUser(answer.authorUserId),
												content: answer.content,
												timePosted: answer.timePosted,
												liking: {
													liked: answer.liked,
													likes: answer.likes,
													castLikeVote: like =>
														this.#boardModel.likeAnswer(questionId, answer.answerId, like),
												},
												reporting: {
													reported: answer.reported,
													reports: answer.reports,
													castReportVote: async report => {
														const confirmed = report
															? await this.share.modals.confirm({
																title: "Report answer?",
																body: "Are you sure you want to submit a report against this answer?",
																yes: {vibe: "negative", label: "Submit report"},
																no: {vibe: "neutral", label: "Nevermind"},
																focusNthElement: 2,
															})
															: true
														if (confirmed)
															await this.#boardModel.reportAnswer(questionId, answer.answerId, report)
													}
												},
												deletePost: canDeleteAnswer(answer)
													? async() => {
														const confirmed = await this.share.modals.confirm({
															title: "Delete answer?",
															body: "Are you sure you want to delete this answer? This cannot be undone.",
															yes: {vibe: "negative", label: "Delete answer"},
															no: {vibe: "neutral", label: "Nevermind"},
															focusNthElement: 2,
														})
														if (confirmed)
															await this.#boardModel.archiveAnswer(questionId, answer.answerId, true)
													}
													: undefined,
											})}
										</li>
									`)}
								</ol>
							` : null}
						</li>
					`
				})}
			</ol>
		`
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
		const numberOfQuestions = this.#boardModel.getQuestions().length

		return renderOp(boardOp, () => html`
			${permissions["moderate questions"]
				? renderModerationPanel({modals, board, archiveBoard})
				: null}
			${permissions["post questions"]
				? renderQuestionEditor({now, access, postingOp, questionEditor})
				: null}
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
