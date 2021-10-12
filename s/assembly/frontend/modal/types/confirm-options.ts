
import {ButtonOptions} from "./button-options.js"
import {TemplateResult} from "../../../../framework/component.js"

export interface ConfirmOptions {
	title: string | TemplateResult
	body?: string | TemplateResult
	yes?: ButtonOptions
	no?: ButtonOptions
	focusNthElement?: number
	blanketClickMeansNo?: boolean
}
