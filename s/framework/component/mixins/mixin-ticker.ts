
import {LitElement} from "lit"
import {Mixin} from "../../../types/mixin.js"
import {ConstructorFor} from "../../../types/constructor-for.js"

export interface TickerComponent {
	tick(): void
}

export function mixinTicker(period: number) {
	return function<C extends ConstructorFor<LitElement>>(
			Base: C
		): Mixin<C, TickerComponent> {

		return <any>class extends Base implements TickerComponent {

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
