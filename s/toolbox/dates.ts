
export function formatDate(milliseconds: number) {
	const date = new Date(milliseconds)

	const twoDigit = (n: number) => n.toString().padStart(2, "0")

	const year = twoDigit(date.getFullYear())
	const month = twoDigit(date.getMonth() + 1)
	const day = twoDigit(date.getDate())

	const hours24 = date.getHours()
	let hours = date.getHours()
	hours %= 12
	hours = hours ? hours : 12
	const minutes = twoDigit(date.getMinutes())

	const ampm = hours24 >= 12 ? "pm" : "am"
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

	return {
		datestring: `${year}-${month}-${day}`,
		timestring: `${hours}:${minutes} ${ampm}`,
		zonestring: `${timeZone}`,
	}
}

const oneSecond = 1000
const oneMinute = oneSecond * 60
const oneHour = oneMinute * 60
const oneDay = oneHour * 24
const plural = (x: number) => x === 1 ? "" : "s"

export function formatDuration(milliseconds: number) {
	const extract = (x: number) => {
		const result = Math.floor(milliseconds / x)
		milliseconds %= x
		return result
	}

	const d = extract(oneDay)
	const h = extract(oneHour)
	const m = extract(oneMinute)
	const s = extract(oneSecond)

	return {
		days: `${d} day${plural(d)}`,
		hours: `${h} hour${plural(h)}`,
		minutes: `${m} minute${plural(m)}`,
		seconds: `${s} second${plural(s)}`,
	}
}
