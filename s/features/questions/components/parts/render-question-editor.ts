
import {renderQuestionBody} from "./render-question-body.js"
import {User} from "../../../auth/aspects/users/types/user.js"
import {html} from "../../../../framework/component/component.js"
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
		<div class=intro>
			<p class=heading>Post a new question</p>
		</div>
		<div class="question2 editor">
			<div class=tophat>
				<xio-profile-card .user=${questionAuthor} show-details></xio-profile-card>
			</div>
			<div class=bubble>
				${renderQuestionBody({
					content,
					editable: true,
					timePosted: Date.now(),
					handleValueChange,
				})}
			</div>
			<div class=buttonbar>
				<xio-button
					?disabled=${!postable}
					@press=${handlePost}
				>Post question</xio-button>
			</div>
		</div>
	`
}
