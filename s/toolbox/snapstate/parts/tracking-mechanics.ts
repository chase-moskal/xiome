
import {debounce} from "../../debounce/debounce.js"
import {debounceDelay} from "./constants.js"
import {SnapstateCircularError} from "./errors.js"
import {Observer, Reaction, Readable} from "./types.js"

export function trackingMechanics() {
	type Session<xState, X> = {observer: Observer<xState, X>, reaction?: Reaction<X>}

	let activeWatch: {
		identifier: symbol
		session: Session<any, any>
	}
	
	const sessions = new Map<string, Map<symbol, Session<any, any>>>()

	function unsubscribe(identifier: symbol) {
		for (const [,record] of sessions)
			record.delete(identifier)
	}

	let waiter: Promise<void> = Promise.resolve()

	return {

		get wait() { return waiter },

		track<xState, X>(state: Readable<xState>, observer: Observer<xState, X>, reaction?: Reaction<X>) {
			const identifier = Symbol()
			activeWatch = {identifier, session: {observer, reaction}}
			observer(state)
			activeWatch = undefined
			return () => unsubscribe(identifier)
		},

		avoidCircular(key: string) {
			if (activeWatch)
				throw new SnapstateCircularError(`cannot set any properties within a reaction, not even "${key}"`)
		},

		triggerReactions: (() => {
			const reactionsQueue: Set<string> = new Set()
			const fireReactionsQueue = debounce(debounceDelay, <xState>(state: Readable<xState>) => {
				for (const key of reactionsQueue) {
					for (const [,{observer, reaction}] of sessions.get(key) ?? []) {
						if (reaction) reaction(observer(state))
						else observer(state)
					}
				}
				reactionsQueue.clear()
			})
			return <xState>(state: Readable<xState>, key: string) => {
				reactionsQueue.add(key)
				const promise = fireReactionsQueue(state)
				waiter = waiter.then(() => promise)
			}
		})(),

		reactionRegistration(key: string) {
			if (activeWatch) {
				let record = sessions.get(key)
				if (!record) {
					record = new Map()
					sessions.set(key, record)
				}
				record.set(activeWatch.identifier, activeWatch.session)
			}
		},
	}
}
