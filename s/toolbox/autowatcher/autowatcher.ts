
import {objectMap} from "../object-map.js"
import {watcherCore} from "./internal/watcher-core.js"
import {Observer, Action, Actions} from "./types/watcher-types.js"

export function autowatcher() {
	const {state, subscribe, triggerObservers} = watcherCore()

	function observable<xObject extends {}>(object: xObject) {
		return new Proxy(object, {
			get(t, key: string) {
				if (state.activeObserver)
					state.schedule.push({
						object,
						key,
						observer: state.activeObserver
					})
				return object[key]
			},
			set(t, key: string, value) {
				object[key] = value
				if (!state.activeAction)
					throw new Error(`autowatcher: cannot set observable outside action, "${key}"`)
				triggerObservers(object, key)
				return true
			},
		})
	}

	function watch(observer: Observer) {
		state.activeObserver = observer
		state.schedule = []
		try {
			observer()
			const recent = state.schedule.map(subscribe)
			return function unsubscribe() {
				for (const {subscription: {key}, record} of recent) {
					const existingObservers = record[key] ?? []
					record[key] = existingObservers.filter(w => w !== observer)
				}
			}
		}
		finally {
			state.activeObserver = undefined
			state.schedule = []
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
