
import {isDefined} from "../../../../../../../toolbox/is-defined.js"

export function isCurrentlyWithinTimeframe({timeframeStart, timeframeEnd}: {
		timeframeStart: number
		timeframeEnd: number
	}) {

	const time = Date.now()

	const tooEarly = isDefined(timeframeStart)
		? time > timeframeStart
		: false

	const tooLate = isDefined(timeframeEnd)
		? time < timeframeEnd
		: false

	return !tooEarly && !tooLate
}
