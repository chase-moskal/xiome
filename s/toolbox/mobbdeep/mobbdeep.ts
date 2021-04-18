
import {objectMap} from "../object-map.js"
import {mobbstate} from "./internal/mobbstate.js"
import {Watcher, Action, Actions} from "./types/mobbtypes.js"

export function mobbdeep() {
	const {state, subscribe, triggerWatchers} = mobbstate()

	function observable<xObject extends {}>(object: xObject) {
		return new Proxy(object, {
			get(t, key: string) {
				if (state.activeWatcher)
					state.watcherSchedule.push({
						object,
						key,
						watcher: state.activeWatcher
					})
				return object[key]
			},
			set(t, key: string, value) {
				object[key] = value
				if (!state.activeAction)
					throw new Error(`mobbdeep: cannot set observable outside action, "${key}"`)
				triggerWatchers(object, key)
				return true
			},
		})
	}

	function watch(watcher: Watcher) {
		state.activeWatcher = watcher
		state.watcherSchedule = []
		try {
			watcher()
			const recent = state.watcherSchedule.map(subscribe)
			return function unsubscribe() {
				for (const {subscription: {key}, record} of recent) {
					const existingWatchers = record[key] ?? []
					record[key] = existingWatchers.filter(w => w !== watcher)
				}
			}
		}
		finally {
			state.activeWatcher = undefined
			state.watcherSchedule = []
		}
	}

	function action<xAction extends Action>(act: xAction) {
		return <xAction>((...args: any[]) => {
			state.activeAction = act
			const result = act(...args)
			state.activeAction = undefined
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

	function actions<xActions extends Actions>(object: xActions): xActions {
		return objectMap(object, value => {
			if (value !== null && typeof value === "object")
				return actions(value)
			else if (typeof value === "function")
				return action(value)
			else
				return value
		})
	}

	function dispose() {
		state.records = new Map()
	}

	return {
		observable,
		observables,
		watch,
		action,
		actions,
		dispose,
	}
}
