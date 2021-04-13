
import {TemplateResult} from "../../../../framework/component.js"

export interface PopupOptions {
	focusNthElement: number
	onBlanketClick: () => void
	renderContent: () => TemplateResult
}
