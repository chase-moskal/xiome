
import {LoadingView} from "../../toolbox/loading/types/loading-view.js"

export function whenLoadingIsDone<xPayload, xResult>(
		view: LoadingView<xPayload>,
		render: (payload: xPayload) => xResult
	): xResult | null {

	return view.ready
		? render(view.payload)
		: null
}
