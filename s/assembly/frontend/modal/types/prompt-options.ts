
import {TemplateResult} from "lit-html"
import {ConfirmOptions} from "./confirm-options"

export interface PromptOptions extends ConfirmOptions {
	input?: TemplateResult
}
