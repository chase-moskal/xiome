
import {Constructor, LitBase} from "../component-types.js"
import {autowatcher} from "../../../toolbox/autowatcher/autowatcher.js"
import {Autowatcher, Track} from "../../../toolbox/autowatcher/types/watcher-types.js"

interface AutowatchComponent extends LitBase {
	auto: Autowatcher
	autotracks: Track[]
}

export function mixinAutowatcher() {
	return function<C extends Constructor<LitBase>>(Base: C) {
		return class extends Base {
			auto = autowatcher()
			autotracks: Track[] = [this.auto.track]
			render() {}

			#unsubscribers: (() => void)[] = []
			#track: Track = ({observer, effect}) => {
				const newUnsubscribers = this.autotracks
					.map(track => track({observer, effect}))
				this.#unsubscribers = [...this.#unsubscribers, ...newUnsubscribers]
				return () => newUnsubscribers.forEach(unsubscribe => unsubscribe())
			}

			connectedCallback() {
				super.connectedCallback()
				this.#track({
					observer: () => this.render(),
					effect: () => this.requestUpdate(),
				})
			}

			disconnectedCallback() {
				super.disconnectedCallback()
				for (const unsubscribe of this.#unsubscribers) {
					unsubscribe()
				}
				this.#unsubscribers = []
			}
		}
	}
}

export function mixinAutotracking(...tracks: Track[]) {
	return function <C extends Constructor<AutowatchComponent>>(Base: C) {
		return class extends Base {
			constructor(...args: any[]) {
				super(...args)
				this.autotracks = [...this.autotracks, ...tracks]
			}
		}
	}
}
