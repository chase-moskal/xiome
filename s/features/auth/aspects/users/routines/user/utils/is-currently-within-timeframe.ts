
import {isDefined} from "../../../../../../../toolbox/is-defined.js"

export function isCurrentlyWithinTimeframe({timeframeStart, timeframeEnd}: {
		timeframeStart: number
		timeframeEnd: number
	}) {

	const time = Number(Date.now().toString().substring(0,10))

	const tooEarly = isDefined(timeframeStart)
		? time < timeframeStart
		: false

	const tooLate = isDefined(timeframeEnd)
		? time > timeframeEnd
		: false

	return !tooEarly && !tooLate
}
