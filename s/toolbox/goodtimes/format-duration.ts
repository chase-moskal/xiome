
import {day, hour, minute, second} from "./times.js"

const plural = (x: number) => x === 1 ? "" : "s"

export function formatDuration(milliseconds: number) {

	const extract = (x: number) => {
		const result = Math.floor(milliseconds / x)
		milliseconds %= x
		return result
	}

	const d = extract(day)
	const h = extract(hour)
	const m = extract(minute)
	const s = extract(second)

	return {
		days: `${d} day${plural(d)}`,
		hours: `${h} hour${plural(h)}`,
		minutes: `${m} minute${plural(m)}`,
		seconds: `${s} second${plural(s)}`,
	}
}
