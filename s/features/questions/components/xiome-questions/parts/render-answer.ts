
import {renderPost} from "./post/render-post.js"
import {PostType} from "./post/types/post-options.js"
import {Answer} from "../../../api/types/questions-and-answers.js"
import {QuestionsBoardModel} from "../../../model/types/board-model.js"
import {ModalSystem} from "../../../../../assembly/frontend/modal/types/modal-system.js"

export function renderAnswer({
		answer, questionId, modals, boardModel, canDeleteAnswer,
	}: {
		answer: Answer
		questionId: string
		modals: ModalSystem
		boardModel: QuestionsBoardModel
		canDeleteAnswer: (answer: Answer) => boolean
	}) {

	const permissions = boardModel.getPermissions()
	const canLike = permissions["like questions"]
	const canReport = permissions["report questions"]

	return renderPost({
		type: PostType.Answer,
		postId: answer.answerId,
		author: boardModel.getUser(answer.authorUserId),
		content: answer.content,
		timePosted: answer.timePosted,
		liking: {
			liked: answer.liked,
			likes: answer.likes,
			castLikeVote: canLike
				? like =>
					boardModel.likeAnswer(questionId, answer.answerId, like)
				: undefined,
		},
		reporting: {
			reported: answer.reported,
			reports: answer.reports,
			castReportVote: canReport
				? async report => {
					const confirmed = report
						? await modals.confirm({
							title: "Report answer?",
							body: "Are you sure you want to submit a report against this answer?",
							yes: {vibe: "negative", label: "Submit report"},
							no: {vibe: "neutral", label: "Nevermind"},
							focusNthElement: 2,
						})
						: true
					if (confirmed)
						await boardModel.reportAnswer(questionId, answer.answerId, report)
				}
				: undefined,
		},
		deletePost: canDeleteAnswer(answer)
			? async() => {
				const confirmed = await modals.confirm({
					title: "Delete answer?",
					body: "Are you sure you want to delete this answer? This cannot be undone.",
					yes: {vibe: "negative", label: "Delete answer"},
					no: {vibe: "neutral", label: "Nevermind"},
					focusNthElement: 2,
				})
				if (confirmed)
					await boardModel.archiveAnswer(questionId, answer.answerId, true)
			}
			: undefined,
	})
}
