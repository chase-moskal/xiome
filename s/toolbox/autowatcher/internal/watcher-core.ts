
import {State, Record, Subscription} from "../types/watcher-types.js"

export function watcherCore() {

	const state: State = {
		records: new Map(),
		schedule: [],
		activeAction: undefined,
		activeObserver: undefined,
	}

	function obtainRecord(object: {}) {
		if (state.records.has(object)) {
			return state.records.get(object)
		}
		else {
			const record: Record = {}
			state.records.set(object, record)
			return record
		}
	}

	function forbidCircularProblems(object: {}, key: string) {
		const subscription = state.schedule.find(subscription =>
			subscription.object === object &&
			subscription.key === key
		)
		if (subscription)
			throw new Error("autowatcher: circular error, a observer watch triggers itself")
	}

	function subscribe(subscription: Subscription) {
		const {object, key, observer} = subscription
		const record = obtainRecord(object)
		const existingObservers = record[key] ?? []
		record[key] = [...existingObservers, observer]
		return {subscription, record}
	}

	function triggerObservers(object: {}, key: string) {
		forbidCircularProblems(object, key)
		const record = obtainRecord(object)
		const observers = record[key] ?? []
		for (const observer of observers)
			observer()
	}

	return {
		state,
		subscribe,
		triggerObservers,
	}
}
