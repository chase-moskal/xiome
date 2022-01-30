
import {renderAnswer} from "./render-answer.js"
import {renderPost} from "./post/render-post.js"
import {PostType} from "./post/types/post-options.js"
import {html} from "../../../../../framework/component.js"
import {makeAnswerEditorGetter} from "./editors/answer-editor.js"
import {renderAnswerEditor} from "./editors/render-answer-editor.js"
import {QuestionsBoardModel} from "../../../model/types/board-model.js"
import {Answer, Question} from "../../../api/types/questions-and-answers.js"
import {ModalSystem} from "../../../../../assembly/frontend/modal/types/modal-system.js"

export function renderQuestion({
		now, question, modals, boardModel, answerEditor,
	}: {
		now: number
		question: Question
		modals: ModalSystem
		boardModel: QuestionsBoardModel
		answerEditor: ReturnType<ReturnType<typeof makeAnswerEditorGetter>>
	}) {

	const {questionId} = question
	const access = boardModel.getAccess()
	const permissions = boardModel.getPermissions()
	const author = boardModel.getUser(question.authorUserId)

	const questionAuthorities = (() => {
		const isAuthor = (access && access.user)
			? access.user.userId === author.userId
			: false
		const canDelete = permissions["moderate questions"] || isAuthor
		const canAnswer = permissions["answer questions"]
		const canLike = permissions["like questions"]
		const canReport = permissions["report questions"]
		return {canDelete, canAnswer, canLike, canReport}
	})()

	const handleDelete = async() => {
		const confirmed = await modals.confirm({
			title: "Delete question?",
			body: "Are you sure you want to delete this question? This cannot be undone.",
			yes: {vibe: "negative", label: "Delete question"},
			no: {vibe: "neutral", label: "Nevermind"},
			focusNthElement: 2,
		})
		if (confirmed)
			await boardModel.archiveQuestion(questionId, true)
	}

	const handleLike = (like: boolean) => {
		boardModel.likeQuestion(questionId, like)
	}

	const handleReport = async(report: boolean) => {
		const confirmed = report
			? await modals.confirm({
				title: "Report question?",
				body: "Are you sure you want to submit a report against this question?",
				yes: {vibe: "negative", label: "Submit report"},
				no: {vibe: "neutral", label: "Nevermind"},
				focusNthElement: 2,
			})
			: true
		if (confirmed)
			await boardModel.reportQuestion(questionId, report)
	}

	const answerEditorState = answerEditor.state

	const canDeleteAnswer = (answer: Answer) => {
		const isAuthor = access?.user?.userId === answer.authorUserId
		return permissions["moderate questions"] || isAuthor
	}

	return html`
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
				castLikeVote: questionAuthorities.canLike
					? handleLike
					: undefined,
			},
			postId: question.questionId,
			reporting: {
				reported: question.reported,
				reports: question.reports,
				castReportVote: questionAuthorities.canReport
					? handleReport
					: undefined,
			},
			timePosted: question.timePosted,
			toggleAnswerEditor: questionAuthorities.canAnswer
				? answerEditor.actions.toggleEditMode
				: undefined,
		})}
		${answerEditorState.editMode
			? renderAnswerEditor({now, boardModel, answerEditor})
			: null}
		${question.answers.length ? html`
			<ol part=answers-list>
				${question.answers.map(answer => html`
					<li part=answer data-answer-id="${answer.answerId}">
						${renderAnswer({
							answer,
							modals,
							questionId,
							boardModel,
							canDeleteAnswer,
						})}
					</li>
				`)}
			</ol>
		` : null}
	`
}
