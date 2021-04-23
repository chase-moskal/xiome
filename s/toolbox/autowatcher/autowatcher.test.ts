
import {Suite, assert, expect} from "cynic"
import {autowatcher} from "./autowatcher.js"

function basicTest() {
	const watcher = autowatcher()
	const state = watcher.observables({count: 0})
	const actions = watcher.actions({increment: () => state.count += 1})

	let called = 0
	const unsubscribe = watcher.watch(() => {
		void state.count
		called += 1
	})

	assert(called === 1, "watch is called once for initialization")
	actions.increment()
	assert(called === 2, "action calls watch")

	return {
		watcher,
		state,
		actions,
		unsubscribe,
		getCalled: () => called,
	}
}

export default <Suite>{
	async "observables changed by actions can be watched"() {
		const {unsubscribe} = basicTest()
		unsubscribe()
	},

	async "parent objects and their children are observable"() {
		const watcher = autowatcher()
		const state = watcher.observables({
			parent: {count: 0},
		})
		const actions = watcher.actions({
			increment: () => state.parent.count += 1,
			setParent: (parent: {count: number}) => state.parent = parent,
		})
		let calledChild = 0
		let calledParent = 0
		const unsubscribe1 = watcher.watch(() => {
			void state.parent.count
			calledChild += 1
		})
		const unsubscribe2 = watcher.watch(() => {
			void state.parent
			calledParent += 1
		})
		assert(calledChild === 1, "initial watch on child")
		assert(calledParent === 1, "initial watch on parent")
		actions.increment()
		assert(calledChild === 2, "child after increment")
		assert(calledParent === 1, "parent after increment")
		actions.setParent({count: 100})
		assert(calledChild === 3, "child after setParent")
		assert(calledParent === 2, "parent after setParent")
		unsubscribe1()
		unsubscribe2()
	},

	async "observable changes outside actions are forbidden"() {
		const {state, unsubscribe} = basicTest()
		expect(() => state.count += 1).throws()
		unsubscribe()
	},

	async "unsubscription ends watch"() {
		const {actions, unsubscribe, getCalled} = basicTest()
		unsubscribe()
		actions.increment()
		assert(getCalled() === 2, "unsubscribed watch isn't triggered")
	},

	async "dispose ends all watches"() {
		const {actions, watcher, getCalled} = basicTest()
		watcher.dispose()
		actions.increment()
		assert(getCalled() === 2, "unsubscribed watch isn't triggered")
	},

	async "different watcherdeep contexts are isolated"() {
		const watcher1 = autowatcher()
		const watcher2 = autowatcher()

		const state1 = watcher1.observable({count: 0})
		const actions1 = watcher1.actions({increment: () => state1.count += 1})
		const actions2 = watcher2.actions({increment: () => state1.count += 1})
		
		expect(() => actions2.increment()).throws()
		
		let called1 = 0
		let called2 = 0
		const unsubscribe1 = watcher1.watch(() => {
			void state1.count
			called1 += 1
		})
		const unsubscribe2 = watcher2.watch(() => {
			void state1.count
			called2 += 1
		})

		actions1.increment()
		assert(called1 === 2, "watch for 1 should work from 1")
		assert(called2 === 1, "watch for 1 should not work from 2")

		unsubscribe1()
		unsubscribe2()
	},

	async "forbids circular behavior"() {
		const {state, actions, watcher, unsubscribe} = basicTest()
		expect(() => {
			watcher.watch(() => {
				void state.count
				actions.increment()
			})
		}).throws()
		unsubscribe()
	},

	async "forbids indirect circular behavior"() {
		const watcher = autowatcher()
		const state = watcher.observables({
			count: 0,
			countPlusOne: 1,
		})
		const actions = watcher.actions({
			increment: () => state.count += 1,
			setCountPlusOne: (value: number) => state.countPlusOne = value,
		})
		watcher.watch(() => {
			actions.setCountPlusOne(state.count + 1)
		})
		expect(() => {
			watcher.watch(() => {
				void state.countPlusOne
				actions.increment()
			})
		}).throws()
		watcher.dispose()
	},
}
