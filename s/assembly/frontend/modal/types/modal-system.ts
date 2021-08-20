
import {PopupOptions} from "./modal-options.js"
import {AlertOptions} from "./alert-options.js"
import {ModalControls} from "./modal-controls.js"
import {PromptOptions} from "./prompt-options.js"
import {ConfirmOptions} from "./confirm-options.js"

export interface ModalSystem {
	popup({}: PopupOptions): {
		modal: HTMLElement
		controls: ModalControls
	}
	confirm({}: ConfirmOptions): Promise<boolean>
	prompt<xValue>({}: PromptOptions<xValue>):
		Promise<undefined | {value: xValue}>
	alert({}: AlertOptions): Promise<void>
}
