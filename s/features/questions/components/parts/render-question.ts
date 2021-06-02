
import {html} from "lit-html"
import {User} from "../../../auth/types/user.js"
import {Question} from "../../topics/types/question.js"
import {renderQuestionBody} from "./render-question-body.js"
import heartSvg from "../../../../framework/icons/heart.svg.js"
import heartFillSvg from "../../../../framework/icons/heart-fill.svg.js"
import warningSvg from "../../../../framework/icons/warning.svg.js"
import warningFillSvg from "../../../../framework/icons/warning-fill.svg.js"

export function renderQuestion({
		author, authority, question,
		handleDelete, handleLike, handleReport,
	}: {
		author: User
		authority: boolean
		question: Question
		handleDelete: () => void
		handleLike: (like: boolean) => void
		handleReport: (report: boolean) => void
	}) {

	const voting = {
		like: question.liked
			? {
				icon: heartFillSvg,
				title: "unlike this post",
				click: () => handleLike(false),
			}
			: {
				icon: heartSvg,
				title: "like this post",
				click: () => handleLike(true),
			},
		report: question.reported
			? {
				icon: warningFillSvg,
				title: "unreport this post",
				click: () => handleReport(false),
			}
			: {
				icon: warningSvg,
				title: "report this post",
				click: () => handleReport(true),
			},
	}

	return html`
		<li data-question-id="${question.questionId}">
			<div class=question-expression>
				<div class=question-voting>
					<button
						data-vote=like
						?data-active=${question.liked}
						tabindex=0
						title="${voting.like.title}"
						@click=${voting.like.click}>
							<span>${voting.like.icon}</span>
							<span>${question.likes}</span>
					</button>
					<button
						data-vote=report
						?data-active=${question.reported}
						tabindex=0
						title="${voting.report.title}"
						@click=${voting.report.click}>
							<span>${voting.report.icon}</span>
							<span>${question.reports}</span>
					</button>
				</div>
				<div class=question-area>
					<xio-profile-card .user=${author}></xio-profile-card>
					${renderQuestionBody({
						editable: false,
						content: question.content,
						timePosted: question.timePosted,
					})}
				</div>
			</div>
			<div class=question-controls>
				${authority
					? html`<xio-button @press=${handleDelete}>delete</xio-button>`
					: null}
			</div>
		</li>
	`
}

// import {User} from "../../../auth/types/user.js"
// import {html} from "../../../../framework/component2/component2.js"
// import {Question} from "../../topics/types/question.js"
// import {AccessPayload} from "../../../auth/types/tokens/access-payload.js"
// import {renderQuestionAuthor} from "./render-question-author.js"
// import {appPermissions} from "../../../../assembly/backend/permissions2/standard-permissions.js"

// export function renderQuestion({
// 		access,
// 		question,
// 		getUser,
// 		handleLikeClick,
// 		handleUnlikeClick,
// 		handleDeleteClick,
// 	}: {
// 		question: Question
// 		access: AccessPayload
// 		getUser: (userId: string) => User
// 		handleLikeClick: () => void
// 		handleUnlikeClick: () => void
// 		handleDeleteClick: () => void
// 	}) {

// 	const {
// 		likes,
// 		liked,
// 		content,
// 		timePosted,
// 		questionId,
// 		authorUserId,
// 	} = question

// 	const author = getUser(authorUserId)
// 	const authority =
// 		author.userId === access.user.userId ||
// 		access.permit.privileges.includes(appPermissions.privileges["moderate questions"])

// 	const renderDeleteButton = () => html`
// 		<button
// 			class="deletebutton"
// 			@click=${handleDeleteClick}
// 			title="Delete question by ${author.profile.nickname}">
// 				Delete
// 		</button>
// 	`

// 	return html`
// 		<div
// 			class="question"
// 			?data-mine=${authority}>
// 			${
// 				renderQuestionAuthor({
// 					author,
// 					timePosted,
// 					likeInfo: {likes, liked},
// 					handleLikeClick,
// 					handleUnlikeClick,
// 					placeholderNickname: "Unknown",
// 				})
// 			}
// 			<div class="body">
// 				<div class="content">${content}</div>
// 				<div class="controls">
// 					${
// 						authority
// 							? renderDeleteButton()
// 							: null
// 					}
// 				</div>
// 			</div>
// 		</div>
// 	`
// }
