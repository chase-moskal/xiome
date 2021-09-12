
import {Suite, assert, expect} from "cynic"
import {madstate} from "./madstate.js"

export default <Suite>{
	async "subscriptions are fired"() {
		const state = madstate({count: 0})
		let fired = 0
		state.subscribe(() => fired += 1)
		state.writable.count += 1
		await state.wait()
		assert(fired === 1, "basic subscription should have fired")
	},
	async "track reactions are fired"() {
		const state = madstate({count: 0, lol: false})
		let fired = 0
		state.track(() => {
			void state.readable.count
			fired += 1
		})
		state.writable.lol = true
		state.writable.count += 1
		await state.wait()
		assert(fired === 2, "track reaction should have fired")
		state.writable.count += 1
		state.writable.count += 1
		state.writable.count += 1
		await state.wait()
		assert(fired === 3, `track reactions should be debounced, 3 expected, got ${fired}`)
	},
	async "advanced tracks are fired"() {
		const state = madstate({count: 0})
		const counts = []
		state.track(({count}) => ({count}), ({count}) => { counts.push(count) })
		state.writable.count = 5
		state.writable.count = 6
		await state.wait()
		assert(counts.length === 1, `advanced reaction should be debounced and fire once, got ${counts.length}`)
		expect(counts[0]).equals(6)
		state.writable.count = 7
		await state.wait()
		assert(counts.length === 2, `advacned reaction should fire twice`)
		expect(counts[1]).equals(7)
	},
	async "readable throws error on write"() {
		const state = madstate({count: 0})
		expect(() => (<any>state).readable.count += 1)
			.throws()
	},
	async "writable can read"() {
		const state = madstate({count: 0})
		state.writable.count += 1
		assert(state.writable.count === 1)
	},
	async "forbid circular: initial track"() {
		const state = madstate({count: 0})
		expect(() => {
			state.track(() => {
				state.writable.count += state.readable.count
			})
		}).throws()
	},
	// async "forbid circular: sneaky track"() {
	// 	const state = madstate({count: 0})
	// 	let cond = false
	// 	state.track(() => {
	// 		void state.readable.count
	// 		if (cond)
	// 			state.writable.count += 1
	// 	})
	// 	cond = true
	// 	await expect(async() => {
	// 		state.writable.count = 1
	// 		await state.wait()
	// 	}).throws()
	// },
	// async "forbid circular: subscription"() {
	// 	const state = madstate({count: 0})
	// 	state.subscribe(() => {
	// 		state.writable.count += 1
	// 	})
	// 	await expect(async() => {
	// 		state.writable.count = 1
	// 		await state.wait()
	// 	}).throws()
	// },
}
