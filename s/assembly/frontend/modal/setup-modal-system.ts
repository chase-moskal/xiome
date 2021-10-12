
import {trapFocus} from "./utils/trap-focus.js"
import {preparePrompt} from "./prefabs/prompt.js"
import {prepareConfirm} from "./prefabs/confirm.js"
import {html} from "../../../framework/component.js"
import {prepareModalSystemRendering} from "./utils/prepare-modal-system-rendering.js"

import {Modal} from "./types/modal.js"
import {ModalSystem} from "./types/modal-system.js"
import {PopupOptions} from "./types/modal-options.js"
import {ModalControls} from "./types/modal-controls.js"
import {prepareAlert} from "./prefabs/alert.js"

export function setupModalSystem() {
	let count = 0
	const modals = new Map<number, Modal>()
	const listModals = () => Array.from(modals.values())
	const {rerender, element} = prepareModalSystemRendering(listModals)

	function popup({focusNthElement, renderContent, onBlanketClick}: PopupOptions) {
		const id = count++
		const controls: ModalControls = {
			rerender,
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
		const modal = element.querySelector<HTMLElement>(`[data-modal="${id}"]`)
		trapFocus(modal, focusNthElement)
		return {controls, modal}
	}

	const confirm = prepareConfirm(popup)

	return {
		modalsElement: element,
		modals: <ModalSystem>{
			popup,
			confirm,
			alert: prepareAlert(confirm),
			prompt: preparePrompt(popup),
		},
	}
}
