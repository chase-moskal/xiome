
import {snapstate} from "@chasemoskal/snapstate"

import {renderView} from "./render-view.js"
import {renderViewCreator} from "./render-view-creator.js"
import {html} from "../../../../../../framework/component.js"
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
			<h3 class=controls-title ?data-open=${readable.open}>
				<div>
					<span>video display controls</span>
					<span>label = <em>"${label}"</em></span>
				</div>
				<xio-button
					class=togglebutton
					title="${readable.open ? "close" : "open"} video controls"
					@press=${toggleControls}>
						${triangle}
				</xio-button>
			</h3>
			${readable.open ? html`
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
						selectedContent: readable.selectedContent,
						isCreateButtonDisabled:
							readable.selectedContent === undefined
							|| readable.selectedPrivileges.length === 0,
						onCatalogSelect: index => {
							writable.selectedContent = index
							writable.selectedPrivileges = []
						},
						isPrivilegeSelected: id => {
							return readable.selectedPrivileges.some(e => e === id)
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
