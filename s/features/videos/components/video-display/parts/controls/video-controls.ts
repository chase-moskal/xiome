
import {renderView} from "./render-view.js"
import {renderViewCreator} from "./render-view-creator.js"
import {html} from "../../../../../../framework/component.js"
import {snapstate} from "../../../../../../toolbox/snapstate/snapstate.js"
import {makeContentModel} from "../../../../models/parts/content-model.js"

export function videoControls({
		queryAll,
		contentModel: model,
		requestUpdate,
	}: {
		contentModel: ReturnType<typeof makeContentModel>
		requestUpdate: () => void
		queryAll: <E extends HTMLElement>(selector: string) => E[]
	}) {

	const {readable, writable, subscribe} = snapstate({
		open: false,
		selectedContent: undefined as number | undefined,
		selectedPrivileges: [] as string[],
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
				<h3>this view <em>"${label}"</em></h3>
				${currentView
					? renderView({
						view: currentView,
						onDeleteClick: () => model.deleteView(label),
						getPrivilegeDisplay: id => model.getPrivilege(id),
					})
					: renderViewCreator({
						queryAll,
						catalogOp: model.state.catalogOp,
						privilegesOp: model.state.privilegesOp,
						isContentSelected: readable.selectedContent !== undefined,
						isCreateButtonDisabled:
							readable.selectedContent === undefined
							|| readable.selectedPrivileges.length === 0,
						onCatalogSelect: index => {
							writable.selectedContent = index
						},
						onPrivilegesSelect: privileges => {
							writable.selectedPrivileges = privileges
						},
						onCreateClick: () => {
							const {selectedContent, selectedPrivileges} = readable
							writable.selectedContent = undefined
							writable.selectedPrivileges = []
							const content = model.catalog[selectedContent]
							model.setView({
								label,
								privileges: selectedPrivileges,
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
						<h3>all other views</h3>
						<div class="otherviews">
							${otherViews.map(
								view => renderView({
									view,
									onDeleteClick: () => model.deleteView(view.label),
									getPrivilegeDisplay: id => model.getPrivilege(id),
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
