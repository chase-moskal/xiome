
import {MobbState, Record, Subscription} from "../types/mobbtypes.js"

export function mobbstate() {

	const state: MobbState = {
		records: new Map(),
		watcherSchedule: [],
		activeAction: undefined,
		activeWatcher: undefined,
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
		const subscription = state.watcherSchedule.find(subscription =>
			subscription.object === object &&
			subscription.key === key
		)
		if (subscription)
			throw new Error("mobbdeep: circular error, a watcher triggers itself")
	}

	function subscribe(subscription: Subscription) {
		const {object, key, watcher} = subscription
		const record = obtainRecord(object)
		const existingWatchers = record[key] ?? []
		record[key] = [...existingWatchers, watcher]
		return {subscription, record}
	}

	function triggerWatchers(object: {}, key: string) {
		forbidCircularProblems(object, key)
		const record = obtainRecord(object)
		const watchers = record[key] ?? []
		for (const watcher of watchers)
			watcher()
	}

	return {
		state,
		subscribe,
		obtainRecord,
		triggerWatchers,
	}
}
