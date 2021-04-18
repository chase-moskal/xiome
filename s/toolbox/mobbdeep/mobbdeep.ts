
import {objectMap} from "../object-map.js"

export function mobbdeep() {
	type Watcher = () => void
	type Record = {[key: string]: Watcher[]}
	type Action = (...args: any[]) => any
	type Actions = {[key: string]: Action}
	type RecentSubscription = {
		record: Record
		key: string
		watcher: Watcher
	}

	const records = new Map<{}, Record>()
	let activeWatcher: Watcher
	let activeAction: () => void
	let activeRecentSubscriptions: RecentSubscription[] = []

	function obtainRecord(object: {}) {
		if (records.has(object)) {
			return records.get(object)
		}
		else {
			const record: Record = {}
			records.set(object, record)
			return record
		}
	}

	function subscribeWatcher(object: {}, key: string, watcher: () => void) {
		const record = obtainRecord(object)
		const existingWatchers = record[key] ?? []
		record[key] = [...existingWatchers, watcher]
		activeRecentSubscriptions.push({
			record,
			key,
			watcher,
		})
	}

	function triggerWatchers(object: {}, key: string, value: () => void) {
		const record = obtainRecord(object)
		const watchers = record[key]
		for (const watcher of watchers)
			watcher()
	}

	function observable<xObject extends {}>(object: xObject) {
		return new Proxy(object, {

			get(target, key: string, receiver) {
				if (activeWatcher)
					subscribeWatcher(object, key, activeWatcher)
				return object[key]
			},

			set(target, key: string, value, receiver) {
				object[key] = value
				if (activeAction)
					triggerWatchers(object, key, value)
				else
					throw new Error(`mobbdeep: cannot set observable outside action, "${key}"`)
				return true
			},
		})
	}

	function watch(watcher: Watcher) {
		activeWatcher = watcher
		activeRecentSubscriptions = []
		watcher()
		activeWatcher = undefined
		const rememberToUnsubscribe = [...activeRecentSubscriptions]
		return function unsubscribe() {
			for (const {record, key, watcher} of rememberToUnsubscribe) {
				const existingWatchers = record[key] ?? []
				record[key] = existingWatchers.filter(w => w !== watcher)
			}
		}
	}

	function action<xAction extends Action>(act: xAction) {
		return <xAction>((...args: any[]) => {
			activeAction = act
			const result = act(...args)
			activeAction = undefined
			return result
		})
	}

	function observables<xObject extends {}>(object: xObject): xObject {
		for (const [key, value] of Object.entries(object)) {
			if (value !== null && typeof value === "object" && !Array.isArray(value))
				object[key] = observables(value)
		}
		return observable(object)
	}

	function actions<xActions extends Actions>(object: xActions) {
		return <xActions>objectMap(object, value => {
			if (value !== null && typeof value === "object")
				return actions(value)
			else if (typeof value === "function")
				return action(value)
			else
				return value
		})
	}

	return {
		observable,
		watch,
		action,
		observables,
		actions,
	}
}
