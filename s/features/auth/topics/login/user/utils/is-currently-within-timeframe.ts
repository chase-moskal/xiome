
export function isCurrentlyWithinTimeframe({timeframeStart, timeframeEnd}: {
		timeframeStart: number
		timeframeEnd: number
	}) {
	const time = Date.now()
	return time > timeframeStart && time < timeframeEnd
}
