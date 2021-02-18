
import {TemplateResult} from "../../../../framework/component.js"
import {ModalControls} from "./modal-controls.js"

export interface PopupOptions {
	focusNthElement: number
	onBlanketClick: (controls: ModalControls) => void
	renderContent: (controls: ModalControls) => TemplateResult
}
