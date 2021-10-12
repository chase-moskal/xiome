
import {Modal} from "../types/modal.js"
import modalSystemStyles from "../modal-system.css.js"
import {render, html} from "../../../../framework/component.js"

export function prepareModalSystemRendering(listModals: () => Modal[]) {

	const style = document.createElement("style")
	render(modalSystemStyles, style)

	const element = document.createElement("div")
	element.setAttribute("data-modal-system", "")

	function rerender() {
		render(html`
			${style}
			${listModals().map(modal => modal.render())}
		`, element)
	}

	return {element, rerender}
}
