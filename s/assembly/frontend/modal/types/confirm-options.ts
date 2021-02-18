
import {TemplateResult} from "lit-html"
import {ButtonOptions} from "./button-options.js"

export interface ConfirmOptions {
	title: string | TemplateResult
	body?: string | TemplateResult
	yes?: ButtonOptions
	no?: ButtonOptions
	focusNthElement?: number
	blanketClickMeansNo?: boolean
}
