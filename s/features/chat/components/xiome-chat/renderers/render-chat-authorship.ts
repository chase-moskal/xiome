
import {html} from "../../../../../framework/component.js"
import {ValueChangeEvent} from "../../../../xio-components/inputs/events/value-change-event.js"

export function renderChatAuthorship({
		sendable, onSendClick, onEnterPress, onValidityChange,
	}: {
		sendable: boolean
		onSendClick: () => void
		onEnterPress: () => void
		onValidityChange: (valid: boolean) => void
	}) {

	function handleContentChange(event: ValueChangeEvent<string>) {
		const value = event.detail.value
		onValidityChange(value !== undefined)
	}

	return html`
		<div class=authorship>

			<xio-text-input
				textarea
				@valuechange=${handleContentChange}
				@enterpress=${onEnterPress}>
					your chat message
			</xio-text-input>

			<xio-button
				?disabled=${!sendable}
				@press=${onSendClick}>
					send message
			</xio-button>
		</div>
	`
}
