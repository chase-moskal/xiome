
import {elem, Elem} from "./elem.js"
import {Constructor} from "../types/constructor.js"
import {LitElement, TemplateResult, PropertyDeclaration, CSSResult} from "lit"

export interface Use<xProps extends {}> extends Elem {
	element: LitElement & xProps

	state<xValue>(
		initial: xValue | ((element: LitElement & xProps) => xValue)
	): [xValue, (v: xValue) => void]

	setup(
		initializer: (element: LitElement & xProps) => (void | (() => void))
	): void
}

export function asPropertyDeclarations<xProps extends {}>(
		declarations: {[P in keyof xProps]: PropertyDeclaration}
	) {
	return declarations
}

export function component<xProps extends {}>(
		options: {
			styles?: CSSResult
			shadow?: boolean
			properties?: {[P in keyof xProps]: PropertyDeclaration}
		},
		renderHtml: (use: Use<xProps>) => TemplateResult,
	) {

	type xConstructor = Constructor<LitElement & xProps>

	return <xConstructor><any>class extends LitElement {
		static readonly styles = options.styles
		static readonly properties = options.properties

		#renderCount = 0
		#stateCount = 0

		#stateMap = new Map<number, any>()
		#teardowns = new Set<() => void>()

		#use: Use<xProps> = {
			element: <any>this,

			...elem(this),

			setup: initializer => {
				if (this.#renderCount === 0) {
					const teardown = initializer(<any>this)
					if (teardown)
						this.#teardowns.add(teardown)
				}
			},

			state: initial => {
				const currentCount = this.#stateCount
				this.#stateCount += 1

				let currentValue: any
				const alreadySet = this.#stateMap.has(currentCount)

				if (alreadySet)
					currentValue = this.#stateMap.get(currentCount)

				else {
					currentValue = (
						(typeof initial === "function")
							? (<any>initial)(this)
							: initial
					)
					this.#stateMap.set(currentCount, currentValue)
				}

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
			this.#teardowns.clear()
			this.#renderCount = 0
			super.disconnectedCallback()
		}

		createRenderRoot() {
			if (options.shadow ?? true)
				return super.createRenderRoot()

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
			const result = renderHtml(this.#use)
			this.#renderCount += 1
			return result
		}
	}
}
