
import {renderView} from "./render-view.js"
import {renderViewCreator} from "./render-view-creator.js"
import {html} from "../../../../../../framework/component.js"
import {snapstate} from "../../../../../../toolbox/snapstate/snapstate.js"
import {makeContentModel} from "../../../../models/parts/content-model.js"
import triangle from "../../../../../../framework/icons/triangle.svg.js"


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
		return html`
			<h2>
				<span>Video display controls</span>
				<xio-button @press=${toggleControls}>
					${readable.open ? html`<div class="open">${triangle}</div>` : html`<div>${triangle}</div>`}
				</xio-button>
			</h2>
			${readable.open ? html`
				<p>label = <em>"${label}"</em></p>
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
			` : null}
		`
	}

	return {
		render,
		subscribe: () => subscribe(requestUpdate),
	}
}
