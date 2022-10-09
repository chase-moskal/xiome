
function secondsToMilliseconds(seconds: number) {
	return seconds * 1000
}

export function timerangeFromStripePeriod({start, end}: {
		start: number
		end: number
	}) {

	return {
		timeframeStart: secondsToMilliseconds(start),
		timeframeEnd: secondsToMilliseconds(end),
	}
}
