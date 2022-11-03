
export class TemplateSlots {

	static readonly parentObservationOptions: MutationObserverInit = {
		childList: true,
	}

	static readonly templateDeepObserverationOptions: MutationObserverInit = {
		childList: true,
		attributes: true,
		characterData: true,
		subtree: true,
	}

	static readonly templateAttributeObserverationOptions: MutationObserverInit = {
		attributes: true,
	}

	#parent: HTMLElement
	#templates = new Map<string, HTMLTemplateElement>()

	#parentObserver: MutationObserver
	#templateObservers = new Set<MutationObserver>

	#onChange = () => {}

	#refresh() {
		for (const observer of this.#templateObservers)
			observer.disconnect()

		this.#templates.clear()
		this.#templateObservers.clear()

		const templates = Array.from(
			this.#parent.querySelectorAll<HTMLTemplateElement>(":scope > template")
		)

		for (const template of templates) {
			const name = template.getAttribute("slot") ?? undefined
			this.#templates.set(name, template)

			const deepObserver = new MutationObserver(this.#onChange)
			const attributeObserver = new MutationObserver(() => {
				this.#refresh()
				this.#onChange()
			})

			deepObserver.observe(template.content, TemplateSlots.templateDeepObserverationOptions)
			attributeObserver.observe(template, TemplateSlots.templateAttributeObserverationOptions)

			this.#templateObservers.add(deepObserver)
		}
	}

	constructor(parent: HTMLElement, onChange = () => {}) {
		this.#parent = parent
		this.#onChange = onChange

		this.#parentObserver = new MutationObserver(() => this.#refresh())
		this.#parentObserver.observe(parent, TemplateSlots.parentObservationOptions)

		this.#refresh()
	}

	get(name?: string) {
		const selector = name
			? `:scope > template[slot="${name}"]`
			: `:scope > template:not([slot])`

		const template = this
			.#parent
			.querySelector<HTMLTemplateElement>(selector)

		return template?.content.cloneNode(true)
	}
}
