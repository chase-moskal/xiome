
import {Suite, assert} from "cynic"
import {nap} from "../nap.js"
import {RateLimiter} from "./rate-limiter.js"

export default <Suite>{
	async "excess hits return false"() {
		const limiter = new RateLimiter({
			maximum: 3,
			timeframe: 100,
		})
		assert(limiter.hit() === true, "hit 1 should return true")
		assert(limiter.hit() === true, "hit 2 should return true")
		assert(limiter.hit() === true, "hit 3 should return true")
		assert(limiter.hit() === false, "hit 4 should return false")
	},
	async "hits return true again after waiting awhile"() {
		const limiter = new RateLimiter({
			maximum: 3,
			timeframe: 100,
		})
		limiter.hit()
		limiter.hit()
		limiter.hit()
		limiter.hit()
		await nap(110)
		assert(limiter.hit() === true, "hit 5 should return true")
		assert(limiter.hit() === true, "hit 6 should return true")
		assert(limiter.hit() === true, "hit 7 should return true")
		assert(limiter.hit() === false, "hit 8 should return false")
	},
}
