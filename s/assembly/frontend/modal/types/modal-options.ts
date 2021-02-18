
import {TemplateResult} from "../../../../framework/component.js"
import {ModalControls} from "./modal-controls.js"

export interface PopupOptions {
	onBlanketClick: (controls: ModalControls) => void
	renderContent: (controls: ModalControls) => TemplateResult
}
