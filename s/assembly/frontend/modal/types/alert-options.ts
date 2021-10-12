
import {ButtonOptions} from "./button-options.js"
import {TemplateResult} from "../../../../framework/component.js"

export interface AlertOptions {
	title: string | TemplateResult
	body?: string | TemplateResult
	button?: ButtonOptions
	focusNthElement?: number
	blanketClickMeansNo?: boolean
}
