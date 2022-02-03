
import {LitElement} from "lit"
import {Observer, Reaction, Snapstate, Subscription} from "@chasemoskal/snapstate"

import {Mixin} from "../../../types/mixin.js"
import {Constructor} from "../../../types/constructor.js"

export type Track = (observer: Observer<any, any>, reaction: Reaction<any>) => () => void

export interface SnapstateTracking {
	attachSnapstateTracking(...tracks: Track[]): void
}

export function mixinSnapstateTracking(...tracks: Track[]) {
	return function<C extends Constructor<LitElement>>(
			Base: C
		): Mixin<C, SnapstateTracking> {

		return <any>class extends Base implements SnapstateTracking {

			#tracks = [...tracks]
			#untracks: (() => void)[] = []

			render() {
				return super.render && super.render()
			}

			#startRenderTracking(...tracks: Track[]) {
				this.#untracks.push(...tracks.map(track => track(
					() => { this.render() },
					() => { this.requestUpdate() },
				)))
			}

			#stopRenderTracking() {
				for (const untrack of this.#untracks)
					untrack()
				this.#untracks = []
			}

			attachSnapstateTracking(...tracks: Track[]) {
				this.#tracks.push(...tracks)
				this.#startRenderTracking(...tracks)
			}

			connectedCallback() {
				super.connectedCallback()
				this.#startRenderTracking(...this.#tracks)
			}

			disconnectedCallback() {
				super.disconnectedCallback()
				this.#stopRenderTracking()
			}
		}
	}
}

export function mixinSnapstate(...states: Snapstate<any>[]) {
	return mixinSnapstateTracking(...states.map(state => state.track))
}

export type Subscribe = (subscription: Subscription<any>) => () => void

export function mixinSnapstateSubscriptions(...subscribes: Subscribe[]) {
	return function<C extends Constructor<LitElement>>(
			Base: C
		): C {

		return class extends Base {

			#unsubscribes: (() => void)[] = []

			connectedCallback() {
				super.connectedCallback()
				const update = () => { this.requestUpdate() }
				this.#unsubscribes = subscribes.map(subscribe => subscribe(update))
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
