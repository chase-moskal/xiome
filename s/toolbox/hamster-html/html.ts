
import {escapeHtml} from "../escape-html.js"

export class HtmlTemplate {
	#strings: string[]
	#values: any[]

	constructor({strings, values}) {
		this.#strings = strings
		this.#values = values
	}

	#processValue(value: any) {
		return value instanceof HtmlTemplate
			? value.toString()
			: escapeHtml(value.toString())
	}

	toString() {
		return this.#strings.reduce(
			(previous, current, index) => {
				const value = this.#values[index] ?? ""
				const safeValue = Array.isArray(value)
					? value.map(this.#processValue).join("")
					: this.#processValue(value)
				return previous + current + safeValue
			},
			""
		)
	}
}

export function html(
		strings: TemplateStringsArray,
		...values: any[]
	): HtmlTemplate {

	return new HtmlTemplate({strings, values})
}

export function render(template: HtmlTemplate) {
	return template.toString()
}
