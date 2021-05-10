
import {objectMap} from "../object-map.js"
import {watcherCore} from "./internal/watcher-core.js"
import {AutowatcherLeakError} from "./internal/watcher-errors.js"
import {Observer, Action, Actions, Effect} from "./types/watcher-types.js"

export function autowatcher() {
	const {state, subscribe, triggerEffects} = watcherCore()

	function observable<xObject extends {}>(object: xObject) {
		return new Proxy(object, {
			get(t, key: string) {
				if (state.activeEffect)
					state.schedule.push({
						object,
						key,
						effect: state.activeEffect,
					})
				return object[key]
			},
			set(t, key: string, value) {
				object[key] = value
				if (!state.activeAction)
					throw new AutowatcherLeakError(key)
				triggerEffects(object, key)
				return true
			},
		})
	}

	function track({observer, effect}: {
			observer: Observer
			effect: Effect
		}) {
		let unsubscribe = () => {}
		state.activeEffect = effect
		state.schedule = []
		try {
			observer()
			const recent = state.schedule.map(subscribe)
			unsubscribe = () => {
				for (const {subscription: {key}, record} of recent) {
					const existingEffects = record[key] ?? []
					record[key] = existingEffects.filter(w => w !== observer)
				}
			}
		}
		finally {
			state.activeEffect = undefined
			state.schedule = []
		}
		return unsubscribe
	}

	function watch(observer: Observer) {
		return track({observer, effect: () => observer()})
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

	function computed<xObject extends {}>(object: xObject) {
		const descriptors = Object.getOwnPropertyDescriptors(object)
		const values = <xObject>{}
		const getters = <xObject>{}
		let unsubscribers: (() => void)[] = []
		for (const [key, descriptor] of Object.entries(descriptors)) {
			if (descriptor.get) {
				const setValue = () => { values[key] = descriptor.get() }
				unsubscribers.push(track({observer: setValue, effect: setValue}))
				getters[key] = () => values[key]
			}
		}
		return {
			getters,
			unsubscribe: () => unsubscribers.forEach(unsub => unsub()),
		}
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
		track,
		watch,
		action,
		actions,
		computed,
		dispose,
	}
}
