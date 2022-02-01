
import {Suite, assert, expect} from "cynic"
import {composeSnapstate, snapstate} from "./snapstate.js"

export default <Suite>{
	async "subscriptions are fired"() {
		const state = snapstate({count: 0})
		let fired = 0
		state.subscribe(() => fired += 1)
		state.writable.count += 1
		await state.wait()
		assert(fired === 1, "basic subscription should have fired")
	},
	async "track reactions are fired"() {
		const state = snapstate({count: 0, lol: false})
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
	async "relevant track reactions are fired"() {
		const state = snapstate({a: 0, b: 0})
		let aReactionCount = 0
		let bReactionCount = 0
		state.track(() => {
			void state.readable.a
			aReactionCount += 1
		})
		state.track(() => {
			void state.readable.b
			bReactionCount += 1
		})
		expect(aReactionCount).equals(1)
		expect(bReactionCount).equals(1)

		state.writable.a += 1
		await state.wait()
		expect(aReactionCount).equals(2)
		expect(bReactionCount).equals(1)

		state.writable.b += 1
		await state.wait()
		expect(aReactionCount).equals(2)
		expect(bReactionCount).equals(2)
	},
	async "advanced tracks are fired"() {
		const state = snapstate({count: 0})
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
		const state = snapstate({count: 0})
		expect(() => (<any>state).readable.count += 1)
			.throws()
	},
	async "writable can read"() {
		const state = snapstate({count: 0})
		state.writable.count += 1
		assert(state.writable.count === 1)
	},
	async "forbid circular: initial track"() {
		const state = snapstate({count: 0})
		expect(() => {
			state.track(() => {
				state.writable.count += state.readable.count
			})
		}).throws()
	},
	"snapstate compose": {
		async "composed snapstates are readable"() {
			const state = composeSnapstate({
				alpha: snapstate({a: 1}),
				bravo: snapstate({b: 1}),
			})
			expect(state.readable.alpha.a).equals(1)
			expect(state.readable.bravo.b).equals(1)
			expect(state.writable.alpha.a).equals(1)
			expect(state.writable.bravo.b).equals(1)
		},
		async "composed snapstates are writable"() {
			const state = composeSnapstate({
				alpha: snapstate({a: 1}),
				bravo: snapstate({b: 1}),
			})
			state.writable.alpha.a = 2
			state.writable.bravo.b = 2
			await state.wait()
			expect(state.readable.alpha.a).equals(2)
			expect(state.readable.bravo.b).equals(2)
			expect(state.writable.alpha.a).equals(2)
			expect(state.writable.bravo.b).equals(2)
		},
		async "composed snapstates are subscribable"() {
			const state = composeSnapstate({
				alpha: snapstate({a: 1}),
				bravo: snapstate({b: 1}),
			})
			let alphaRead: number
			let bravoRead: number
			state.subscribe(() => {
				alphaRead = state.readable.alpha.a
				bravoRead = state.readable.bravo.b
			})

			state.writable.alpha.a = 2
			await state.wait()
			expect(state.readable.alpha.a).equals(2)
			expect(alphaRead).equals(2)

			state.writable.bravo.b = 2
			await state.wait()
			expect(state.readable.bravo.b).equals(2)
			expect(bravoRead).equals(2)
		},
		async "composed snapstates are trackable"() {
			const state = composeSnapstate({
				alpha: snapstate({a: 1}),
				bravo: snapstate({b: 1}),
			})
			let numberOfAlphaTrackingResponses = 0
			let numberOfBravoTrackingResponses = 0
			state.track(() => void state.readable.alpha.a, () => {
				numberOfAlphaTrackingResponses += 1
			})
			state.track(() => void state.readable.bravo.b, () => {
				numberOfBravoTrackingResponses += 1
			})
			expect(numberOfAlphaTrackingResponses).equals(0)
			expect(numberOfBravoTrackingResponses).equals(0)

			state.writable.alpha.a += 1
			await state.wait()
			expect(numberOfAlphaTrackingResponses).equals(1)
			expect(numberOfBravoTrackingResponses).equals(0)

			state.writable.bravo.b += 1
			await state.wait()
			expect(numberOfAlphaTrackingResponses).equals(1)
			expect(numberOfBravoTrackingResponses).equals(1)
		},
	},

	// async "forbid circular: sneaky track"() {
	// 	const state = snapstate({count: 0})
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
	// 	const state = snapstate({count: 0})
	// 	state.subscribe(() => {
	// 		state.writable.count += 1
	// 	})
	// 	await expect(async() => {
	// 		state.writable.count = 1
	// 		await state.wait()
	// 	}).throws()
	// },
}
