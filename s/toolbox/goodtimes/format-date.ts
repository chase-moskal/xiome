
export function formatDate(milliseconds: number) {
	const d = new Date(milliseconds)

	const twoDigit = (n: number) => n.toString().padStart(2, "0")
	const year = twoDigit(d.getFullYear())
	const month = twoDigit(d.getMonth() + 1)
	const day = twoDigit(d.getDate())

	const hours24 = d.getHours()
	let hours = d.getHours()
	hours %= 12
	hours = hours ? hours : 12
	const minutes = twoDigit(d.getMinutes())

	const ampm = hours24 >= 12 ? "pm" : "am"
	const timezoneOffsetMinutes = -d.getTimezoneOffset()
	const timezoneOffset = (timezoneOffsetMinutes / 60).toFixed(
		timezoneOffsetMinutes % 60 === 0
			? 0
			: 1
	)
	const timezoneUtc = timezoneOffsetMinutes === 0
		? "UTC"
		: `UTC${timezoneOffsetMinutes < 0 ? "" : "+"}${timezoneOffset}`
	const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone
	const timezone = `${timezoneName} ${timezoneUtc}`

	const date = `${year}-${month}-${day}`
	const time = `${hours}:${minutes} ${ampm}`
	const zone = `${timezone}`
	const full = `${date} ${time} (${zone})`

	return {
		date,
		time,
		zone,
		full,
	}
}
