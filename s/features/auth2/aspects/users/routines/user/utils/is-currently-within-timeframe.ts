
export function isCurrentlyWithinTimeframe({timeframeStart, timeframeEnd}: {
		timeframeStart: number
		timeframeEnd: number
	}) {

	const time = Date.now()

	const tooEarly = timeframeStart !== undefined
		? time > timeframeStart
		: false

	const tooLate = timeframeEnd !== undefined
		? time < timeframeEnd
		: false

	return !tooEarly && !tooLate
}
