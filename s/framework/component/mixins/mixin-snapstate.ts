
import {Subscribe} from "../../../toolbox/pubsub.js"
import {Track} from "../../../toolbox/snapstate/parts/types.js"
import {Constructor, LitBase} from "../types/component-types.js"

export function mixinSnapstateTracking(...tracks: Track[]) {
	return function<C extends Constructor<LitBase>>(Base: C) {
		return class extends Base {

			#tracks: Track[] = [...tracks]
			#unsubscribes: (() => void)[] = []

			render() {
				return super.render && super.render()
			}

			#subscribe = (track: Track) => {
				return track(
					() => { this.render() },
					() => { this.requestUpdate() },
				)
			}

			#sub(tracks: Track[]) {
				this.#unsubscribes.push(...tracks.map(this.#subscribe))
			}

			#unsub() {
				for (const unsubscribe of this.#unsubscribes)
					unsubscribe()
				this.#unsubscribes = []
			}

			attachTracking(...newTracks: Track[]) {
				this.#tracks.push(...newTracks)
				this.#sub(newTracks)
			}

			connectedCallback() {
				super.connectedCallback()
				this.#sub(this.#tracks)
			}

			disconnectedCallback() {
				super.disconnectedCallback()
				this.#unsub()
			}
		}
	}
}

export function mixinSnapstateSubscriptions(...subscriptions: Subscribe[]) {
	return function<C extends Constructor<LitBase>>(Base: C) {
		return class extends Base {

			#unsubscribes: (() => void)[] = []

			connectedCallback() {
				super.connectedCallback()
				const update = () => { this.requestUpdate() }
				this.#unsubscribes =
					subscriptions.map(subscription => subscription(update))
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
