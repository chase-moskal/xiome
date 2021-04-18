
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

	#unsub = () => {}

	connectedCallback() {
		super.connectedCallback()
		const unsubs = watches.map(watch => watch(() => this.render()))
		this.#unsub = () => unsubs.forEach(unsub => unsub())
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.#unsub()
	}
}

export type WithShare<S extends Share, T extends {}> = T & ConstructorFor<{
	readonly share: S
}>
