
import {day, hour, minute, second} from "./times.js"

const plural = (x: number) => x === 1 ? "" : "s"

export function formatDuration(milliseconds: number) {

	const extract = (x: number) => {
		const result = Math.floor(milliseconds / x)
		milliseconds %= x
		return result
	}

	const days = extract(day)
	const hours = extract(hour)
	const minutes = extract(minute)
	const seconds = extract(second)

	const readable = {
		days: `${days} day${plural(days)}`,
		hours: `${hours} hour${plural(hours)}`,
		minutes: `${minutes} minute${plural(minutes)}`,
		seconds: `${seconds} second${plural(seconds)}`,
	}

	const ago =
		days > 3
			? `${readable.days} ago`
			: days > 1
				? `${readable.days} and ${readable.hours} ago`
				: hours > 3
					? `${readable.hours} ago`
					: hours > 1
						? `${readable.hours} and ${readable.minutes} ago`
						: minutes > 3
							? `${readable.minutes} ago`
							: minutes > 1
								? `${readable.minutes} and ${readable.seconds} ago`
								: `${readable.seconds} ago`

	return {
		...readable,
		ago,
	}
}
