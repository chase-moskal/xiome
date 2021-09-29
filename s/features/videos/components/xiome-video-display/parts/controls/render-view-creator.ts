
import {Op} from "../../../../../../framework/ops.js"
import {VideoHosting} from "../../../../types/video-concepts.js"
import {html} from "../../../../../../framework/component/component.js"
import {renderOp} from "../../../../../../framework/op-rendering/render-op.js"

export function renderViewCreator({
		catalogOp, setCatalogSelection, onCreateClick,
	}: {
		catalogOp: Op<VideoHosting.AnyContent[]>
		setCatalogSelection: (index: number) => void
		onCreateClick: () => void
	}) {

	const onSelectChange = (event: InputEvent) => {
		const target = event.target as HTMLSelectElement
		setCatalogSelection(parseInt(target.value))
	}

	return html`
		<p>create view</p>
		${renderOp(catalogOp, catalog => html`
			<select @change=${onSelectChange}>
				${catalog.map(({provider, type, title}, index) => html`
					<option value=${index}>
						${`${provider} ${type} ${title}`}
					</option>
				`)}
			</select>
			<xio-button @press=${onCreateClick}>create view</xio-button>
		`)}
	`
}
