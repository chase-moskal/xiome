
import {html} from "lit-html"
import {Question} from "../../topics/types/question.js"

export function renderQuestion({question}: {question: Question}) {
	return html`
		<li data-question-id="${question.questionId}">
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
