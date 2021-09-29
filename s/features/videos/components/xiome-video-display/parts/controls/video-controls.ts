
import {html} from "../../../../../../framework/component/component.js"
import {madstate} from "../../../../../../toolbox/madstate/madstate.js"
import {makeContentModel} from "../../../../models/parts/content-model.js"
import {renderViewCreator} from "./render-view-creator.js"
import {renderView} from "./render-view.js"

export function videoControls({
		contentModel: model,
		requestUpdate,
	}: {
		contentModel: ReturnType<typeof makeContentModel>
		requestUpdate: () => void
	}) {

	const {readable, writable, subscribe} = madstate({
		open: false,
		catalogSelectionIndex: 0,
	})

	const toggleControls = () => {
		writable.open = !writable.open
	}

	function render(label: string) {
		const currentView = model.getView(label)
		const otherViews = model.views
			.filter(view => view.label !== label)

		return html`
			<h2>
				<span>video display controls</span>
				<xio-button @press=${toggleControls}>
					${readable.open ? "close" : "open"}
				</xio-button>
			</h2>
			${readable.open ? html`
				<p>this view <em>"${label}"</em></p>
				${currentView
					? renderView({
						view: currentView,
						onDeleteClick: () => model.deleteView(label),
					})
					: renderViewCreator({
						catalogOp: model.state.catalogOp,
						setCatalogSelection: index => {
							writable.catalogSelectionIndex = index
						},
						onCreateClick: () => {
							const content = model.catalog[readable.catalogSelectionIndex]
							model.setView({
								label,
								privileges: [],
								reference: {
									id: content.id,
									type: content.type,
									provider: content.provider,
								},
							})
						}
					})}
				${otherViews.length
					? html`
						<p>all other views</p>
						<div class="otherviews">
							${otherViews.map(
								view => renderView({
									view,
									onDeleteClick: () => model.deleteView(view.label),
								})
							)}
						</div>
					`
					: null}
			` : null}
		`
	}

	return {
		render,
		subscribe: () => subscribe(requestUpdate),
	}
}
