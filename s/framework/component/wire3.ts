
import {WiredComponent} from "../component.js"
import {ConstructorFor} from "../../types/constructor-for.js"

export type Share = any

export const wire3 = <S extends {}, C extends ConstructorFor<WiredComponent<S>>>(
		Constructor: C,
		object: S,
		...watches: ((watcher: () => void) => () => void)[]
	) => <ConstructorFor<WiredComponent<S>>><any>class extends (<any>Constructor) {

	get share() {
		return object
	}

	autorun() {}

	#active = false
	#unsub = () => {}
	#render = () => {
		this.render()
		if (this.#active) this.requestUpdate()
	}

	connectedCallback() {
		super.connectedCallback()
		const unsubs = [
			...watches.map(watch => watch(() => this.autorun())),
			...watches.map(watch => watch(() => this.#render())),
		]
		this.#unsub = () => unsubs.forEach(unsub => unsub())
		this.#active = true
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.#active = false
		this.#unsub()
	}
}

export type WithShare<S extends Share, T extends {}> = T & ConstructorFor<{
	readonly share: S
}>
