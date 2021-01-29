
import {html, TemplateResult} from "./component.js"
import {LoadingView} from "../toolbox/loading/types/loading-view.js"

export function renderLoading<xPayload>(
		loadingView: LoadingView<xPayload>,
		render: (payload: xPayload) => TemplateResult,
	) {

	return html`
		<zap-loading .loadingView=${loadingView}>
			${loadingView.ready
				? render(loadingView.payload)
				: null}
		</zap-loading>
	`
}
