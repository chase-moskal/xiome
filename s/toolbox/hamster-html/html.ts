
import {escapeHtml} from "../escape-html.js"

export class HtmlTemplate {
	#strings: string[]
	#values: any[]
	constructor({strings, values}) {
		this.#strings = strings
		this.#values = values
	}
	toString() {
		let result = ""
		this.#strings.forEach((string, index) => {
			result += `${string}${index === this.#strings.length - 1
				?""
				:this.#values[index] instanceof HtmlTemplate
					? this.#values[index]
					: escapeHtml(this.#values[index])
			}`
		})
		return result
	}
}

export function html(strings: TemplateStringsArray, ...values:any[]): HtmlTemplate {
	return new HtmlTemplate({strings, values})
}

export function render(template: HtmlTemplate) {
	return template.toString()
}
