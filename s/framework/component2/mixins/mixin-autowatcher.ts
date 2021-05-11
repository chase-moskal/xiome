
import {Constructor, LitBase} from "../component-types.js"
import {autowatcher} from "../../../toolbox/autowatcher/autowatcher.js"
import {Track} from "../../../toolbox/autowatcher/types/watcher-types.js"

export function mixinAutowatcher<C extends Constructor<LitBase>>(Base: C) {
	return class extends Base {
		auto = autowatcher()
		autotracks: Track[] = [this.auto.track]

		#unsubscribers: (() => void)[] = []
		#track: Track = ({observer, effect}) => {
			const newUnsubscribers = this.autotracks
				.map(track => track({observer, effect}))
			this.#unsubscribers = [...this.#unsubscribers, ...newUnsubscribers]
			return () => newUnsubscribers.forEach(unsubscribe => unsubscribe())
		}

		render() {}

		firstUpdated() {
			this.#track({
				observer: () => this.render(),
				effect: () => this.requestUpdate(),
			})
		}

		dispose() {
			for (const unsubscribe of this.#unsubscribers)
				unsubscribe()
			this.#unsubscribers = []
			this.auto.dispose()
		}

		// connectedCallback() {
		// 	super.connectedCallback()
		// 	this.#track({
		// 		observer: () => this.render(),
		// 		effect: () => this.requestUpdate(),
		// 	})
		// }

		// disconnectedCallback() {
		// 	super.disconnectedCallback()
		// 	for (const unsubscribe of this.#unsubscribers) {
		// 		unsubscribe()
		// 	}
		// 	this.#unsubscribers = []
		// }
	}
}
