
import {LitElement} from "lit-element"
import {Subscribe} from "../../../toolbox/pubsub.js"
import {Track} from "../../../toolbox/madstate/parts/types.js"
import {Constructor, LitBase} from "../types/component-types.js"

export function mixinMadstateTracking(...tracks: Track[]) {
	return function<C extends Constructor<LitBase>>(Base: C) {
		return class extends Base {

			#unsubscribes: (() => void)[] = []

			render() {
				return this.render()
			}

			renderTracking(track: Track) {
				const observer = () => { this.render() }
				const reaction = () => { if (this.isConnected) this.requestUpdate() }
				this.#unsubscribes.push(
					track(observer, reaction)
				)
			}

			firstUpdated(...args: Parameters<LitElement["firstUpdated"]>) {
				if (super.firstUpdated)
					super.firstUpdated(...args)
				for (const track of tracks)
					this.renderTracking(track)
			}

			stopRenderTracking() {
				for (const unsubscribe of this.#unsubscribes)
					unsubscribe()
				this.#unsubscribes = []
			}
		}
	}
}

export function mixinMadstateSubscriptions(...subscriptions: Subscribe[]) {
	return function<C extends Constructor<LitBase>>(Base: C) {
		return class extends Base {

			#unsubscribes: (() => void)[] = []

			connectedCallback() {
				super.connectedCallback()
				const update = () => {
					this.requestUpdate()
				}
				this.#unsubscribes =
					subscriptions
						.map(subscription => subscription(update))
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
