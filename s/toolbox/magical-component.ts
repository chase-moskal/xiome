
import {LitElement, TemplateResult} from "lit"

export interface Use<xProps extends {}> {
	element: LitElement & xProps

	state<xValue>(
		initial: xValue | ((element: LitElement & xProps) => xValue)
	): [xValue, (v: xValue) => void]

	setup(
		initializer: (element: LitElement & xProps) => void
	): void
}

export type Sauce<xProps extends {}> = (
	(props: xProps) =>
		(use: Use<xProps>) =>
			TemplateResult
)

export function component<xProps>(sauce: Sauce<xProps>) {
	type xConstructor = (
		(...args: ConstructorParameters<typeof LitElement>) =>
			InstanceType<typeof LitElement> & xProps
	)
	return <xConstructor><any>class extends LitElement {
		props: xProps
		#setup = false
		#stateCount = 0
		#stateMap = new Map<number, any>()
		#use: Use<xProps> = {
			element: <any>this,

			setup: initializer => {
				if (!this.#setup)
					initializer(<any>this)
				this.#setup = true
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

		render() {
			this.#stateCount = 0
			return sauce(<any>this)(this.#use)
		}
	}
}
