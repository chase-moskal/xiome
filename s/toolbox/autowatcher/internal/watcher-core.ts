
import {State, Record, Subscription} from "../types/watcher-types.js"
import {AutowatcherCircularError} from "./watcher-errors.js"

export function watcherCore() {

	const state: State = {
		records: new Map(),
		schedule: [],
		activeAction: undefined,
		activeEffect: undefined,
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
			throw new AutowatcherCircularError(subscription)
	}

	function subscribe(subscription: Subscription) {
		const {object, key, effect} = subscription
		const record = obtainRecord(object)
		const existingEffects = record[key] ?? []
		record[key] = [...existingEffects, effect]
		return {subscription, record}
	}

	function triggerEffects(object: {}, key: string) {
		forbidCircularProblems(object, key)
		const record = obtainRecord(object)
		const effects = record[key] ?? []
		for (const effect of effects)
			effect()
	}

	return {
		state,
		subscribe,
		triggerEffects,
	}
}
