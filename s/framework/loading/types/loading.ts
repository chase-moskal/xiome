
import {LoadingView} from "./loading-view.js"
import {LoadingActions} from "./loading-actions.js"

export interface Loading<xPayload> {
	view: LoadingView<xPayload>
	actions: LoadingActions<xPayload>
}
