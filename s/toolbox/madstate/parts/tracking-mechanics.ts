
import {debounce3} from "../../debounce2.js"
import {debounceDelay} from "./constants.js"
import {MadstateCircularError} from "./errors.js"

export function trackingMechanics() {
	let activeReaction: () => void
	const reactions: {[key: string]: (() => void)[]} = {}
	return {

		track(reaction: () => void) {
			activeReaction = reaction
			reaction()
			activeReaction = undefined
		},

		avoidCircular(key: string) {
			if (activeReaction)
				throw new MadstateCircularError(`cannot set any properties within a reaction, not even "${key}"`)
		},

		triggerReactions: (() => {
			let reactionsToTrigger: string[] = []
			const fireQueuedTriggers = debounce3(debounceDelay, () => {
				for (const key of reactionsToTrigger)
					for (const reaction of reactions[key] ?? [])
						reaction()
				reactionsToTrigger = []
			})
			return (key: string) => {
				reactionsToTrigger.push(key)
				fireQueuedTriggers()
			}
		})(),

		reactionRegistration(key: string) {
			if (activeReaction)
				reactions[key] = [...(reactions[key] ?? []), activeReaction]
		},
	}
}
