
import {html} from "../../../../../../../framework/component.js"
import {formatDate} from "../../../../../../../toolbox/goodtimes/format-date.js"
import {ValueChangeEvent} from "../../../../../../xio-components/inputs/events/value-change-event.js"
import {validatePostContent} from "../../../../../api/services/validation/validate-question-draft.js"

export function renderBubble({
		content,
		editable,
		timePosted,
		handleValueChange = () => {},
	}: {
		content: string
		editable: boolean
		timePosted: number
		handleValueChange?: (event: ValueChangeEvent<string>) => void
	}) {

	const {date, time} = formatDate(timePosted)
	
	return html`
		<div class=bubble ?data-editable=${editable}>
			<div class=textbox>
				${editable
					? html`
						<xio-text-input
							exportparts="textinput: bubble"
							textarea
							.validator=${validatePostContent}
							@valuechange=${handleValueChange}
						></xio-text-input>
					`
					: html`
						<p part=bubble>${content}</p>
					`}
			</div>
			<div class=metabar>
				<p>${`${date} ${time}`}</p>
			</div>
		</div>
	`
}
