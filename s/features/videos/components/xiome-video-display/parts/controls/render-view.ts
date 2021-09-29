
import {VideoView} from "../../../../types/video-concepts.js"
import {html} from "../../../../../../framework/component/component.js"

export function renderView({view, onDeleteClick}: {
		view: VideoView
		onDeleteClick: () => void
	}) {
	return html`
		<div class="view">
			<p>label: ${view.label}</p>
			<p>provider: ${view.provider}</p>
			<p>type: ${view.type}</p>
			<p>id: ${view.id}</p>
			<xio-button @press=${onDeleteClick}>delete view</xio-button>
		</div>
	`
}
