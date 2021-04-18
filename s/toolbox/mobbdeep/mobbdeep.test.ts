
import {mobbdeep} from "./mobbdeep.js"
import {Suite, assert, expect} from "cynic"

function basicTest() {
	const mobb = mobbdeep()
	const state = mobb.observables({count: 0})
	const actions = mobb.actions({increment: () => state.count += 1})

	let called = 0
	const unsubscribe = mobb.watch(() => {
		void state.count
		called += 1
	})

	assert(called === 1, "watch is called once for initialization")
	actions.increment()
	assert(called === 2, "action calls watch")

	return {
		mobb,
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
		const {actions, mobb, getCalled} = basicTest()
		mobb.dispose()
		actions.increment()
		assert(getCalled() === 2, "unsubscribed watch isn't triggered")
	},

	async "different mobbdeep contexts are isolated"() {
		const mobb1 = mobbdeep()
		const mobb2 = mobbdeep()

		const state1 = mobb1.observable({count: 0})
		const actions1 = mobb1.actions({increment: () => state1.count += 1})
		const actions2 = mobb2.actions({increment: () => state1.count += 1})
		
		expect(() => actions2.increment()).throws()
		
		let called1 = 0
		let called2 = 0
		const unsubscribe1 = mobb1.watch(() => {
			void state1.count
			called1 += 1
		})
		const unsubscribe2 = mobb2.watch(() => {
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
		const {state, actions, mobb, unsubscribe} = basicTest()
		expect(() => {
			mobb.watch(() => {
				void state.count
				actions.increment()
			})
		}).throws()
		unsubscribe()
	},

	async "forbids indirect circular behavior"() {
		const mobb = mobbdeep()
		const state = mobb.observables({
			count: 0,
			countPlusOne: 1,
		})
		const actions = mobb.actions({
			increment: () => state.count += 1,
			setCountPlusOne: (value: number) => state.countPlusOne = value,
		})
		mobb.watch(() => {
			actions.setCountPlusOne(state.count + 1)
		})
		expect(() => {
			mobb.watch(() => {
				void state.countPlusOne
				actions.increment()
			})
		}).throws()
		mobb.dispose()
	},
}
