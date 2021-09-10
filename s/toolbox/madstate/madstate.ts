
import {subbies} from "../subbies.js"
import {Readable} from "./parts/types.js"
import {debounce3} from "../debounce2.js"
import {debounceDelay} from "./parts/constants.js"
import {MadstateReadonlyError} from "./parts/errors.js"
import {trackingMechanics} from "./parts/tracking-mechanics.js"

export function madstate<xState extends {}>(actual: xState) {
	const tracking = trackingMechanics()

	function get(t: any, key: string) {
		tracking.reactionRegistration(key)
		return actual[key]
	}

	const readable: Readable<xState> = new Proxy(actual, {
		get,
		set(t, key: string) {
			throw new MadstateReadonlyError(`readonly state property "${key}"`)
		},
	})

	const {publish: rawPublish, subscribe} = subbies<Readable<xState>>()
	const publishReadable = debounce3(debounceDelay, () => rawPublish(readable))

	let waiter: Promise<void> = Promise.resolve()

	const writable: xState = new Proxy(actual, {
		get,
		set(t, key: string, value) {
			tracking.avoidCircular(key)
			actual[key] = value
			tracking.triggerReactions(key)
			waiter = publishReadable()
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
