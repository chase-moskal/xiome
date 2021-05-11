
import {Op, ops} from "../ops.js"

export function whenOpReady<xValue, xResult>(
		op: Op<xValue>,
		render: (value: xValue) => xResult
	): xResult | null {

	return ops.isReady(op)
		? render(ops.value(op))
		: null
}
