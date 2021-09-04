
import {Reaction} from "./types.js"
import {debounce3} from "../../debounce2.js"
import {debounceDelay} from "./constants.js"
import {MadstateCircularError} from "./errors.js"

export function trackingMechanics() {
	let activeTrack: {
		identifier: symbol
		reaction: Reaction
	}

	const reactionRecords = new Map<string, Map<symbol, Reaction>>()

	function unsubscribe(identifier: symbol) {
		for (const [,record] of reactionRecords)
			record.delete(identifier)
	}

	let waiter: Promise<void> = Promise.resolve()

	return {

		get wait() { return waiter },

		track(observer: () => void, reaction?: () => void) {
			reaction = reaction ?? observer
			const identifier = Symbol()
			activeTrack = {identifier, reaction}
			observer()
			activeTrack = undefined
			return () => unsubscribe(identifier)
		},

		avoidCircular(key: string) {
			if (activeTrack)
				throw new MadstateCircularError(`cannot set any properties within a reaction, not even "${key}"`)
		},

		triggerReactions: (() => {
			const reactionsToTrigger: Set<string> = new Set()
			const fireQueuedTriggers = debounce3(debounceDelay, () => {
				for (const key of reactionsToTrigger)
					for (const [,reaction] of reactionRecords.get(key) ?? [])
						reaction()
				reactionsToTrigger.clear()
			})
			return (key: string) => {
				reactionsToTrigger.add(key)
				const promise = fireQueuedTriggers()
				waiter = waiter.then(() => promise)
			}
		})(),

		reactionRegistration(key: string) {
			if (activeTrack) {
				let record = reactionRecords.get(key)
				if (!record) {
					record = new Map()
					reactionRecords.set(key, record)
				}
				record.set(activeTrack.identifier, activeTrack.reaction)
			}
		},
	}
}
