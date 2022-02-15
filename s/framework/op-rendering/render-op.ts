
import {Op} from "../ops.js"
import {whenOpReady} from "./when-op-ready.js"
import {html} from "../component.js"

export function renderOp<xValue, xResult>(
		op: Op<xValue>,
		render: (value: xValue) => xResult,
		more: any = null,
		{loadingMessage, errorMessage, showErrorText}: {
			loadingMessage?: string
			errorMessage?: string
			showErrorText?: boolean
		} = {},
	) {

	return html`
		<xio-op
			.op=${op}
			loading-message="${loadingMessage}"
			error-message="${errorMessage}"
			show-error-text="${showErrorText}">
				${whenOpReady(op, render)}
				${more}
		</xio-op>
	`
}
