
import {TemplateResult} from "../../../../framework/component.js"

export interface ButtonOptions {
	label: string | TemplateResult
	vibe: "neutral" | "positive" | "negative"
}
