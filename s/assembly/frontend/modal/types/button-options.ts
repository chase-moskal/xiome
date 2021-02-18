
import {TemplateResult} from "lit-html"

export interface ButtonOptions {
	label: string | TemplateResult
	vibe: "neutral" | "positive" | "negative"
}
