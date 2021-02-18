
import {PopupOptions} from "./modal-options.js"
import {ModalControls} from "./modal-controls.js"
import {PromptOptions} from "./prompt-options.js"
import {ConfirmOptions} from "./confirm-options.js"

export interface ModalSystem {
	popup({}: PopupOptions): ModalControls
	confirm({}: ConfirmOptions): Promise<boolean>
	prompt({}: PromptOptions): Promise<{}>
}
