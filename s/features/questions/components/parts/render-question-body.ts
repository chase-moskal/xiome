
import {html} from "lit-html"
import {formatDate} from "../../../../toolbox/goodtimes/format-date.js"
import {ValueChangeEvent} from "../../../xio-components/inputs/events/value-change-event.js"
import {validateQuestionDraftContent} from "../../topics/validation/validate-question-draft.js"

export function renderQuestionBody({
		editable,
		postedTime,
		handleValueChange = () => {},
	}: {
		editable: boolean
		postedTime: number
		handleValueChange?: (event: ValueChangeEvent<string>) => void
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
				<xio-text-input
					textarea
					?readonly=${!editable}
					.validator=${validateQuestionDraftContent}
					@valuechange=${handleValueChange}
				></xio-text-input>
			</div>
		</div>
	`
}
