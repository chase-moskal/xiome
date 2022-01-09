
import {Bucket} from "./bucket.js"

export class RateLimiter {
	#timeframe: number
	#maximum: number
	#bucket: Bucket<number>

	constructor({timeframe, maximum}: {
			timeframe: number
			maximum: number
		}) {
		this.#timeframe = timeframe
		this.#maximum = maximum
		this.#bucket = new Bucket({maximum})
	}

	hit(): boolean {
		const now = Date.now()
		const old = now - this.#timeframe
		const hitsWithinTimeframe = this.#bucket.read().filter(time => time > old)
		if (hitsWithinTimeframe.length < this.#maximum) {
			this.#bucket.add(now)
			return true
		}
		else {
			return false
		}
	}

	tooMany(): boolean {
		return !this.hit()
	}
}
