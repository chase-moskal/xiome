
import {html} from "lit-html"
import {formatDate} from "../../../../toolbox/goodtimes/format-date.js"

export function renderQuestionBody({editable, postedTime}: {
		editable: boolean
		postedTime: number
	}) {

	const {date, time} = formatDate(postedTime)
	
	return html`
		<div class=question-body ?data-editable=${editable}>
			<div class=metabar>
				<p>
					${`${date} ${time}`}
				</p>
			</div>
			<div class=textbox>
				<textarea></textarea>
			</div>
		</div>
	`
}
