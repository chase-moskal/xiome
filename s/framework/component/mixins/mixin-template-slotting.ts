
import {LitElement} from "lit"
import {Mixin} from "../../../types/mixin.js"
import {Constructor} from "../../../types/constructor.js"

export class TemplateSlots {
	#templates = new Map<string, HTMLTemplateElement>()

	constructor(element: HTMLElement) {
		const templates = Array.from(
			element.querySelectorAll<HTMLTemplateElement>(":scope > template")
		)
		for (const template of templates) {
			const name = template.getAttribute("data-name") ?? undefined
			this.#templates.set(name, template)
		}
	}

	get(name?: string) {
		return this.#templates.get(name).content.cloneNode(true)
	}
}

export function mixinTemplateSlotting<C extends Constructor<LitElement>>(
		Base: C
	): Mixin<C, {slots: TemplateSlots}> {

	return <any>class extends Base {

		slots = new TemplateSlots(this)

		createRenderRoot() {
			const root = document.createElement("div")
			this.appendChild(root)
			return root
		}
	}
}
