
export function timestamp() {
	const date = new Date()
	const year = date.getUTCFullYear()
	const month = (date.getUTCDate() + 1).toString().padStart(2, "0")
	const day = date.getUTCDate().toString().padStart(2, "0")
	const hours = date.getUTCHours().toString().padStart(2, "0")
	const minutes = date.getUTCMinutes().toString().padStart(2, "0")
	const seconds = date.getUTCSeconds().toString().padStart(2, "0")
	const milliseconds = date.getUTCMilliseconds().toString().padStart(3, "0")

	const calendar = `${year}-${month}-${day}`
	const clock = `${hours}:${minutes}:${seconds}.${milliseconds}`
	return `[${calendar} ${clock}]`
}
