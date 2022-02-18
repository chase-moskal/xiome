
import {escapeHtml} from "../escape-html.js"
import {escapeRegex} from "../escape-regex.js"

export class HtmlTemplate {
	#strings: string[]
	#values: any[]

	constructor({strings, values}) {
		this.#strings = strings
		this.#values = values
	}

	#processValue(value: any): string {
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

	async #processAsyncValue(value: any): Promise<string> {
		return value instanceof HtmlTemplate
			? await value.render()
			: escapeHtml(value.toString())
	}

	async render() {
		const results = await Promise.all(this.#strings.map(async(string, index) => {
			const value = await this.#values[index] ?? ""
			const safeValue = Array.isArray(value)
				? (await Promise.all(value.map(this.#processAsyncValue))).join("")
				: await this.#processAsyncValue(value)
			return string + safeValue
		}))
		return results.join("")
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

export function unsanitized(value: string) {
	return new HtmlTemplate({strings: [value], values: []})
}

export function untab(code: string) {
	const lines = code.split(/\r|\n/)

	let baseTabLevel: number
	for (const line of lines) {
		const isOnlyWhitespace = /^\s+$/.test(line)
		if (!isOnlyWhitespace) {
			const tabMatch = line.match(/^(\t+).+/)
			if (tabMatch) {
				const tabCount = tabMatch[1].length
				baseTabLevel = baseTabLevel === undefined
					? tabCount
					: tabCount < baseTabLevel
						? tabCount
						: baseTabLevel
				if (baseTabLevel === 0)
					break
			}
		}
	}

	const rebaseTabRegex = new RegExp(`^\\t{${baseTabLevel}}`)

	return lines
		.map(line => /^\s+$/.test(line) ? "" : line)
		.map(line => line.replace(rebaseTabRegex, ""))
		.join("\n")
}

export function attrMaybe(attr: string, value: string | undefined) {
	return value !== undefined
		? html`${attr}="${value}"`
		: ""
}

export function attrBool(attr: string, value: boolean) {
	return value
		? attr
		: ""
}

export function maybe<V>(value: V, realize: (value: V) => any) {
	return value
		? realize(value)
		: undefined
}
