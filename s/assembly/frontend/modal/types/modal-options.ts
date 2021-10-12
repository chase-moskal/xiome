
import {ModalControls} from "./modal-controls.js"
import {TemplateResult} from "../../../../framework/component.js"

export interface PopupOptions {
	focusNthElement: number
	onBlanketClick: (controls: ModalControls) => void
	renderContent: (controls: ModalControls) => TemplateResult
}
