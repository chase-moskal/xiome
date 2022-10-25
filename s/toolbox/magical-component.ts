
import {Constructor} from "../types/constructor.js"
import {LitElement, TemplateResult, PropertyDeclaration, CSSResult} from "lit"

export interface Use<xProps extends {}> {
	element: LitElement & xProps

	state<xValue>(
		initial: xValue | ((element: LitElement & xProps) => xValue)
	): [xValue, (v: xValue) => void]

	setup(
		initializer: (element: LitElement & xProps) => (void | (() => void))
	): void
}

export function component<xProps extends {}>(options: {
		styles?: CSSResult
		shadow?: boolean
		properties?: {[P in keyof xProps]: PropertyDeclaration}
		render: (use: Use<xProps>) => TemplateResult
	}) {

	type xConstructor = Constructor<LitElement & xProps>

	return <xConstructor><any>class extends LitElement {
		static readonly styles = options.styles
		static readonly properties = options.properties
		#renderCount = 0
		#stateCount = 0
		#stateMap = new Map<number, any>()
		#teardowns: (() => void)[] = []
		#use: Use<xProps> = {
			element: <any>this,

			setup: initializer => {
				if (this.#renderCount === 0) {
					const teardown = initializer(<any>this)
					if (teardown)
						this.#teardowns.push(teardown)
				}
			},

			state: initial => {
				const currentCount = this.#stateCount
				this.#stateCount += 1

				let currentValue: any
				const alreadySet = this.#stateMap.has(currentCount)

				if (alreadySet)
					currentValue = this.#stateMap.get(currentCount)
				else
					currentValue = (
						(typeof initial === "function")
							? (<any>initial)(this)
							: initial
					)

				return [
					currentValue,
					newValue => {
						this.#stateMap.set(currentCount, newValue)
						this.requestUpdate()
					},
				]
			},
		}

		disconnectedCallback() {
			for (const teardown of this.#teardowns)
				teardown()
			this.#renderCount = 0
			super.disconnectedCallback()
		}

		createRenderRoot() {
			if (options.shadow ?? true) {
				return super.createRenderRoot()
			}
			else {
				const style = document.createElement("style")
				style.textContent = options.styles.cssText

				const root = document.createElement("div")

				this.appendChild(style)
				this.appendChild(root)

				return root
			}
		}

		render() {
			this.#stateCount = 0
			const result = options.render(this.#use)
			this.#renderCount += 1
			return result
		}
	}
}

export class TemplateSlots {
	#templates = new Map<string, HTMLTemplateElement>()

	constructor(element: HTMLElement) {
		const templates = Array.from(
			element.querySelectorAll<HTMLTemplateElement>(":scope > template")
		)
		for (const template of templates) {
			const name = template.getAttribute("slot") ?? undefined
			this.#templates.set(name, template)
		}
	}

	get(name?: string) {
		return this.#templates.get(name)?.content.cloneNode(true) ?? null
	}
}

// export function component<xProps extends {}>(
// 		props: {[P in keyof xProps]: PropertyDeclaration},
// 		renderer: (use: Use<xProps>) => TemplateResult
// 	) {

// 	type xConstructor = (
// 		(...args: ConstructorParameters<typeof LitElement>) =>
// 			InstanceType<typeof LitElement> & xProps
// 	)

// 	return <xConstructor><any>class extends LitElement {
// 		static readonly properties = props
// 		#setup = false
// 		#stateCount = 0
// 		#stateMap = new Map<number, any>()
// 		#use: Use<xProps> = {
// 			element: <any>this,

// 			setup: initializer => {
// 				if (!this.#setup)
// 					initializer(<any>this)
// 				this.#setup = true
// 			},

// 			state: initial => {
// 				const currentCount = this.#stateCount
// 				this.#stateCount += 1

// 				let currentValue: any
// 				const alreadySet = this.#stateMap.has(currentCount)

// 				if (alreadySet)
// 					currentValue = this.#stateMap.get(currentCount)
// 				else
// 					currentValue = (
// 						(typeof initial === "function")
// 							? (<any>initial)(this)
// 							: initial
// 					)

// 				return [
// 					currentValue,
// 					newValue => {
// 						this.#stateMap.set(currentCount, newValue)
// 						this.requestUpdate()
// 					},
// 				]
// 			},
// 		}

// 		render() {
// 			this.#stateCount = 0
// 			return renderer(this.#use)
// 		}
// 	}
// }
