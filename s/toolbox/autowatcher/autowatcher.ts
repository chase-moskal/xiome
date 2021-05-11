
import {objectMap} from "../object-map.js"
import {autowatcherCore} from "./core/autowatcher-core.js"
import {AutowatcherLeakError} from "./core/autowatcher-errors.js"
import {Action, Actions, Effect, Stakeout, Watcher} from "./types/autowatcher-types.js"

export function autowatcher() {
	const {context, subscribe, triggerObservation} = autowatcherCore()

	function observable<xObject extends {}>(object: xObject) {
		return new Proxy(object, {
			get(t, key: string) {
				if (context.activeStakeout)
					context.newObservablesSchedule.push({
						object,
						key,
						stakeout: context.activeStakeout,
					})
				return object[key]
			},
			set(t, key: string, value) {
				object[key] = value
				if (!context.activeAction)
					throw new AutowatcherLeakError(key)
				triggerObservation(object, key)
				return true
			},
		})
	}

	function track<X>(stakeout: Stakeout<X>) {
		let unsubscribe = () => {}
		let done = () => {}
		context.activeStakeout = stakeout
		context.newObservablesSchedule = []
		try {
			const initialObservation = stakeout.watcher()
			done = stakeout.effect
				? () => stakeout.effect(initialObservation)
				: done
			const recent = context.newObservablesSchedule
				.map(scheduled => subscribe(scheduled))
			unsubscribe = () => {
				for (const {subscription: {key}, record} of recent) {
					const existingStakeouts = record[key] ?? []
					record[key] = existingStakeouts.filter(s => s !== stakeout)
				}
			}
		}
		finally {
			context.activeStakeout = undefined
			context.newObservablesSchedule = []
			done()
		}
		return unsubscribe
	}

	function watch<X>(watcher: Watcher<X>, effect?: Effect<X>) {
		return track({watcher, effect})
	}

	function action<xAction extends Action>(act: xAction) {
		return <xAction>((...args: any[]) => {
			context.activeAction = act
			const result = act(...args)
			context.activeAction = undefined
			return result
		})
	}

	// const unsubscribeComputedSymbol = Symbol("unsubscribe")

	// function computed<xObject extends {}>(object: xObject) {
	// 	const descriptors = Object.getOwnPropertyDescriptors(object)
	// 	const values = <xObject>{}
	// 	const getters = <xObject>{...object}
	// 	let unsubscribers: (() => void)[] = []
	// 	for (const [key, descriptor] of Object.entries(descriptors)) {
	// 		if (descriptor.get) {
	// 			const setValue = () => { values[key] = descriptor.get() }
	// 			unsubscribers.push(watch(setValue))
	// 			Object.defineProperty(getters, key, {
	// 				get: () => values[key],
	// 				enumerable: true,
	// 				configurable: false,
	// 			})
	// 		}
	// 	}
	// 	getters[unsubscribeComputedSymbol] =
	// 		() => unsubscribers.forEach(unsub => unsub())
	// 	return getters
	// }

	function state<xObject extends {}>(object: xObject): xObject {
		for (const [key, value] of Object.entries(object)) {
			if (value !== null && typeof value === "object" && !Array.isArray(value))
				object[key] = state(value)
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
		context.observableRecords = new Map()
	}

	return {
		observable,
		state,
		track,
		watch,
		action,
		actions,
		dispose,
	}
}
