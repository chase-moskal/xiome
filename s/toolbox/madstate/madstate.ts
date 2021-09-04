
import {pubsub} from "../pubsub.js"
import {Readable} from "./parts/types.js"
import {debounce3} from "../debounce2.js"
import {debounceDelay} from "./parts/constants.js"
import {MadstateReadonlyError} from "./parts/errors.js"
import {trackingMechanics} from "./parts/tracking-mechanics.js"

export function madstate<xState extends {}>(actual: xState) {
	const tracking = trackingMechanics()

	const readable: Readable<xState> = new Proxy(actual, {
		get(t, key: string) {
			tracking.reactionRegistration(key)
			return actual[key]
		},
		set(t, key: string) {
			throw new MadstateReadonlyError(`cannot set property "${key}"`)
		},
	})

	const {publish, subscribe} = pubsub<(state: Readable<xState>) => void>()
	const debouncedPublish = debounce3(debounceDelay, () => {
		publish(readable)
	})

	let waiter: Promise<void> = Promise.resolve()

	const writable = new Proxy(actual, {
		get(t, key: string) {
			tracking.reactionRegistration(key)
			return actual[key]
		},
		set(t, key: string, value) {
			tracking.avoidCircular(key)
			actual[key] = value
			tracking.triggerReactions(key)
			waiter = debouncedPublish()
			return true
		},
	})

	return {
		readable,
		writable,
		subscribe,
		track: tracking.track,
		async wait() {
			await Promise.all([waiter, tracking.wait])
		},
	}
}
