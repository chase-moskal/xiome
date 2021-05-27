
import {Constructor, LitBase} from "../component-types.js"
import {AnyListener, Subscribe} from "../../../toolbox/pubsub.js"

export function mixinHappy(...onStateChanges: Subscribe<AnyListener>[]) {
	return function<C extends Constructor<LitBase>>(Base: C) {
		return class extends Base {

			#unsubscribes: (() => void)[] = []

			connectedCallback() {
				super.connectedCallback()

				const update = () => {
					this.requestUpdate()
				}

				this.#unsubscribes =
					onStateChanges
						.map(onStateChange => onStateChange(update))
			}

			disconnectedCallback() {
				super.disconnectedCallback()

				for (const unsubscribe of this.#unsubscribes)
					unsubscribe()

				this.#unsubscribes = []
			}
		}
	}
}
