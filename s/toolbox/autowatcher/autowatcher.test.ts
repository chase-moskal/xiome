
import {Suite, assert, expect} from "cynic"
import {autowatcher} from "./autowatcher.js"

function basicTest() {
	const auto = autowatcher()
	const state = auto.state({count: 0})
	const actions = auto.actions({increment: () => state.count += 1})

	let called = 0
	const unsubscribe = auto.watch(() => {
		void state.count
		called += 1
	})

	assert(called === 1, "watch is called once for initialization")
	actions.increment()
	assert(called === 2, "action calls watch")

	return {
		auto,
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
		const auto = autowatcher()
		const state = auto.state({
			parent: {count: 0},
		})
		const actions = auto.actions({
			increment: () => state.parent.count += 1,
			setParent: (parent: {count: number}) => state.parent = parent,
		})
		let calledChild = 0
		let calledParent = 0
		const unsubscribe1 = auto.watch(() => {
			void state.parent.count
			calledChild += 1
		})
		const unsubscribe2 = auto.watch(() => {
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
		const {actions, auto, getCalled} = basicTest()
		auto.dispose()
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
		const {state, actions, auto, unsubscribe} = basicTest()
		expect(() => {
			auto.watch(() => {
				void state.count
				actions.increment()
			})
		}).throws()
		unsubscribe()
	},

	async "forbids indirect circular behavior"() {
		const auto = autowatcher()
		const state = auto.state({
			count: 0,
			countPlusOne: 1,
		})
		const actions = auto.actions({
			increment: () => state.count += 1,
			setCountPlusOne: (value: number) => state.countPlusOne = value,
		})
		auto.watch(() => {
			actions.setCountPlusOne(state.count + 1)
		})
		expect(() => {
			auto.watch(() => {
				void state.countPlusOne
				actions.increment()
			})
		}).throws()
		auto.dispose()
	},

	async "effect receives observation"() {
		const auto = autowatcher()
		const state = auto.state({
			count: 0,
		})
		const actions = auto.actions({
			setCount(count: number) {
				state.count = count
			},
		})
		let lastEffect: number
		auto.watch(
			() => state.count + 1,
			x => lastEffect = x,
		)
		assert(state.count === 0, "count starts zero")
		assert(lastEffect === 1, "effect is initialized")
		actions.setCount(5)
		assert(state.count === 5, "setting count works")
		assert(lastEffect === 6, "effect is correctly receives observation")
	},

	// async "computeds work"() {
	// 	const auto = autowatcher()
	// 	const state = auto.state({
	// 		count: 0,
	// 	})
	// 	const actions = auto.actions({
	// 		setCount(count: number) {
	// 			state.count = count
	// 		},
	// 	})
	// 	const computed = auto.computed({
	// 		get oneMore() {
	// 			return state.count + 1
	// 		}
	// 	})
	// 	assert(computed.oneMore === 1, "computed one more works initially")
	// 	actions.setCount(7)
	// 	assert(computed.oneMore === 8, "computed one more works after action")
	// },

	// async "computeds work as part of state"() {
	// 	const auto = autowatcher()
	// 	const state = auto.state({
	// 		count: 0,
	// 		get oneMore() {
	// 			return this.count + 1
	// 		},
	// 	})
	// 	const actions = auto.actions({
	// 		setCount(count: number) {
	// 			state.count = count
	// 		},
	// 	})
	// 	assert(state.oneMore === 1, "computed one more works initially")
	// 	actions.setCount(7)
	// 	assert(state.oneMore === 8, "computed one more works after action")
	// },
}
