
import {TemplateResult} from "lit-html"

export interface ConfirmOptions {
	title: string | TemplateResult
	body?: string | TemplateResult
	yes?: string
	no?: string
}
