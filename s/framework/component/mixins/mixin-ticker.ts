
import {Constructor, LitBase} from "../types/component-types.js"

export function mixinTicker(period: number) {
	return function<C extends Constructor<LitBase>>(Base: C) {
		return class extends Base {

			#interval: NodeJS.Timer

			tick() {}

			connectedCallback() {
				super.connectedCallback()
				this.#interval = setInterval(() => {
					this.tick()
					this.requestUpdate()
				}, period)
			}

			disconnectedCallback() {
				super.disconnectedCallback()
				clearInterval(this.#interval)
			}
		}
	}
}
