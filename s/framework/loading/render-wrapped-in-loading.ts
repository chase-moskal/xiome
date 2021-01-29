
import {html} from "../component.js"
import {whenLoadingIsDone} from "./when-loading-is-done.js"
import {LoadingView} from "./types/loading-view.js"

export function renderWrappedInLoading<xPayload, xResult>(
		view: LoadingView<xPayload>,
		render: (payload: xPayload) => xResult,
		more: any = null,
	) {

	return html`
		<xio-loading .loadingView=${view}>
			${whenLoadingIsDone(view, render)}
			${more}
		</xio-loading>
	`
}
