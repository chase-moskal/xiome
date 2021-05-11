
import {AutowatcherCircularError} from "./autowatcher-errors.js"
import {Context, ObservableRecord, ScheduledObservable} from "../types/autowatcher-types.js"

export function autowatcherCore() {
	const context: Context = {
		observableRecords: new Map(),
		newObservablesSchedule: [],
		activeAction: undefined,
		activeStakeout: undefined,
	}

	function obtainRecord(object: {}) {
		if (context.observableRecords.has(object)) {
			return context.observableRecords.get(object)
		}
		else {
			const record: ObservableRecord = {}
			context.observableRecords.set(object, record)
			return record
		}
	}

	function forbidCircularProblems(object: {}, key: string) {
		const scheduled = context.newObservablesSchedule.find(s =>
			s.object === object &&
			s.key === key
		)
		if (scheduled)
			throw new AutowatcherCircularError(scheduled)
	}

	function subscribe(subscription: ScheduledObservable) {
		const {object, key, stakeout} = subscription
		const record = obtainRecord(object)
		const stakeouts = record[key] ?? []
		record[key] = [...stakeouts, stakeout]
		return {subscription, record}
	}

	function triggerObservation(object: {}, key: string) {
		forbidCircularProblems(object, key)
		const record = obtainRecord(object)
		const stakeouts = record[key] ?? []
		for (const {watcher, effect} of stakeouts) {
			if (effect)
				effect(watcher())
			else
				watcher()
		}
	}

	return {
		context,
		subscribe,
		triggerObservation,
	}
}
