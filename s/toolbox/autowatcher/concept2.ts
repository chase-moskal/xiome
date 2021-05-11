
import {objectMap} from "../object-map.js"

export type Watcher<X> = () => X
export type Action = (...args: any[]) => any
export type Effect<X> = (observation: X) => void

export type Stakeout<X> = {
	watcher: Watcher<X>
	effect?: Effect<X>
}

export type Watch<X> = (stakeout: Stakeout<X>) => () => void

export interface ObservableRecord {
	[key: string]: Stakeout<any>[]
}

export interface Actions {
	[key: string]: Action
}

export interface ScheduledObservable {
	object: {}
	key: string
	stakeout: Stakeout<any>
}

export interface Context {
	observableRecords: Map<{}, ObservableRecord>
	newObservablesSchedule: ScheduledObservable[]
	activeAction: Action
	activeStakeout: Stakeout<any>
}

export class AutowatcherCircularError extends Error {
	constructor(scheduled: ScheduledObservable) {
		super(`an effect changes an observable, named "${scheduled.key}", that triggers that same effect, causing an infinite circle`)
	}
}

export class AutowatcherLeakError extends Error {
	constructor(key: string) {
		super(`cannot set observable, named "${key}", outside a formalized action`)
	}
}

function makeContext() {
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

export function autowatcher() {
	const {context, subscribe, triggerObservation} = makeContext()

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

	const unsubscribeComputedSymbol = Symbol("unsubscribe")

	function computed<xObject extends {}>(object: xObject) {
		const descriptors = Object.getOwnPropertyDescriptors(object)
		const values = <xObject>{}
		const getters = <xObject>{...object}
		let unsubscribers: (() => void)[] = []
		for (const [key, descriptor] of Object.entries(descriptors)) {
			if (descriptor.get) {
				const setValue = () => { values[key] = descriptor.get() }
				unsubscribers.push(watch(setValue))
				Object.defineProperty(getters, key, {
					get: () => values[key],
					enumerable: true,
					configurable: false,
				})
			}
		}
		getters[unsubscribeComputedSymbol] =
			() => unsubscribers.forEach(unsub => unsub())
		return getters
	}

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
		unsubscribeComputedSymbol,
		observable,
		state,
		track,
		watch,
		action,
		actions,
		computed,
		dispose,
	}
}
