
import {html} from "lit-html"

import {Modal} from "./types/modal.js"
import {ModalSystem} from "./types/modal-system.js"
import {PopupOptions} from "./types/modal-options.js"
import {ModalControls} from "./types/modal-controls.js"

import {preparePrompt} from "./prefabs/prompt.js"
import {prepareConfirm} from "./prefabs/confirm.js"
import {prepareModalSystemRendering} from "./utils/prepare-modal-system-rendering.js"

export function installModalSystem() {
	let count = 0
	const modals = new Map<number, Modal>()
	const listModals = () => Array.from(modals.values())
	const {rerender, element} = prepareModalSystemRendering(listModals)

	function popup({renderContent, onBlanketClick}: PopupOptions) {
		const id = count++
		const controls: ModalControls = {
			close: () => {
				modals.delete(id)
				rerender()
			},
		}
		const top = window.pageYOffset
			?? document.documentElement.scrollTop
			?? document.body.scrollTop
			?? 0
		const handleBlanketClick = () => onBlanketClick(controls)
		modals.set(id, {
			render() {
				return html`
					<div data-modal="${id}">
						<div data-blanket @click=${handleBlanketClick}></div>
						<div data-plate style="top: ${top}px">
							${renderContent(controls)}
						</div>
					</div>
				`
			},
		})
		rerender()
		return controls
	}

	return {
		modalsElement: element,
		modals: <ModalSystem>{
			popup,
			confirm: prepareConfirm(popup),
			prompt: preparePrompt(popup),
		},
	}
}
