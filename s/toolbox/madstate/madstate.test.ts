
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
		assert(fired === 3, `track reactions are debounced (${fired})`)
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
}
