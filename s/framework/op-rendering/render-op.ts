
import {Op} from "../ops.js"
import {whenOpReady} from "./when-op-ready.js"
import {html} from "../component2/component2.js"

export function renderOp<xValue, xResult>(
		op: Op<xValue>,
		render: (value: xValue) => xResult,
		more: any = null,
	) {

	return html`
		<xio-op .op=${op}>
			${whenOpReady(op, render)}
			${more}
		</xio-op>
	`
}
