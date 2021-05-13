
import {PropertyValues} from "../component2.js"
import {Constructor, LitBase} from "../component-types.js"
import {autowatcher} from "../../../toolbox/autowatcher/autowatcher.js"
import {Track} from "../../../toolbox/autowatcher/types/autowatcher-types.js"

export function mixinAutowatcher<C extends Constructor<LitBase>>(Base: C) {
	return class extends Base {
		auto = autowatcher()
		#unsubscribers: (() => void)[] = []

		render() {}

		subscribeAutotrack = (track: Track<any>) => {
			this.#unsubscribers.push(
				track({
					watcher: () => this.render(),
					effect: () => this.requestUpdate(),
				})
			)
		}

		firstUpdated(changes: PropertyValues) {
			this.subscribeAutotrack(this.auto.track)
		}

		dispose() {
			for (const unsubscribe of this.#unsubscribers)
				unsubscribe()
			this.#unsubscribers = []
			this.auto.dispose()
		}
	}
}
