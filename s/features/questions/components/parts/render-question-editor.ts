
import {html} from "lit-html"
import {User} from "../../../auth/types/user.js"
import {renderQuestionBody} from "./render-question-body.js"
import {PressEvent} from "../../../xio-components/button/events/press-event.js"
import {ValueChangeEvent} from "../../../xio-components/inputs/events/value-change-event.js"

export function renderQuestionEditor({
		content,
		postable,
		questionAuthor,
		handlePost,
		handleValueChange,
	}: {
		content: string
		postable: boolean
		questionAuthor: User
		handlePost: (event: PressEvent) => void
		handleValueChange: (event: ValueChangeEvent<string>) => void
	}) {
	return html`
		<div class=question-editor>
			<div class=editor-intro>
				<p class=editor-heading>Post a new question</p>
			</div>
			<div class=editor-textbox>
				${renderQuestionBody({
					content,
					editable: true,
					timePosted: Date.now(),
					handleValueChange,
				})}
			</div>
			<div class=editor-profile>
				<xio-profile-card .user=${questionAuthor} show-details></xio-profile-card>
			</div>
			<div class=editor-buttons>
				<xio-button
					?disabled=${!postable}
					@press=${handlePost}
				>Post question</xio-button>
			</div>
		</div>
	`
}
