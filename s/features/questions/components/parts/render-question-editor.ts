
import {html} from "lit-html"
import {User} from "../../../auth/types/user.js"
import {renderQuestionBody} from "./render-question-body.js"

export function renderQuestionEditor({questionAuthor}: {
		questionAuthor: User
	}) {
	return html`
		<div class=question-editor>
			<div class=editor-intro>
				<p class=editor-heading>Post a new question</p>
			</div>
			<div class=editor-textbox>
				${renderQuestionBody({
					editable: true,
					postedTime: Date.now()
				})}
			</div>
			<div class=editor-profile>
				<xio-profile-card .user=${questionAuthor}></xio-profile-card>
			</div>
			<div class=editor-buttons>
				<xio-button>Post question</xio-button>
			</div>
		</div>
	`
}

// import {User} from "../../../auth/types/user.js"
// import {html} from "../../../../framework/component2/component2.js"
// import {renderQuestionAuthor} from "./render-question-author.js"
// import {QuestionValidation} from "../types/question-validation.js"

// export function renderQuestionEditor({
// 		author,
// 		validation,
// 	}: {
// 		expand: boolean
// 		draftText: string
// 		maxCharacterLimit: number
// 		validation: QuestionValidation
// 		author?: User
// 		handlePostClick: (event: MouseEvent) => void
// 		handleTextAreaChange: (event: Event) => void
// 	}) {

// 	const {message, postable, angry} = validation
// 	const invalid = !!message

// 	return html`
// 		<div class="question editor">
// 			${renderQuestionAuthor({
// 				author,
// 				likeInfo: undefined,
// 				timePosted: Date.now(),
// 				handleLikeClick: () => {},
// 				handleUnlikeClick: () => {},
// 			})}
// 			<div class="body">
// 				<textarea
// 					class="content"
// 					placeholder="type your question here"
// 					maxlength=${maxCharacterLimit}
// 					?data-expand=${expand}
// 					@change=${handleTextAreaChange}
// 					@keyup=${handleTextAreaChange}
// 					.value=${draftText}
// 				></textarea>
// 				<div class="controls">
// 					${message
// 						? html`
// 							<p
// 								class="message"
// 								?data-angry=${angry}
// 								?data-active=${invalid}>
// 									${message}
// 							</p>
// 						` : null}
// 					<button
// 						?disabled=${!postable}
// 						@click=${handlePostClick}
// 						class="postbutton"
// 						title="Post your question to the board">
// 							Post
// 					</button>
// 				</div>
// 			</div>
// 		</div>
// 	`
// }
