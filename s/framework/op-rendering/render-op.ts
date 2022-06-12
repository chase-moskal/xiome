
import {Op} from "../ops.js"
import {whenOpReady} from "./when-op-ready.js"
import {html} from "../component.js"

export function renderOp<xValue, xResult>(
		op: Op<xValue>,
		render: (value: xValue) => xResult,
		more: any = null,
		{loadingMessage = "", errorMessage = "", hideErrorText = false}: {
			loadingMessage?: string
			errorMessage?: string
			hideErrorText?: boolean
		} = {},
	) {

	return html`
		<xio-op
			.op=${op}
			loading-message="${loadingMessage}"
			error-message="${errorMessage}"
			?hide-error-text=${hideErrorText}>
				${whenOpReady(op, render)}
				${more}
		</xio-op>
	`
}
