
import {LoadingMode} from "./loading-mode.js"
import {LoadingSelector} from "./loading-selector.js"

export interface LoadingView<xPayload> {
	readonly none: boolean
	readonly loading: boolean
	readonly error: boolean
	readonly ready: boolean
	readonly reason: string
	readonly payload: xPayload
	select<xResult>(selector: LoadingSelector<xPayload, xResult>): xResult
	readonly mode: LoadingMode
}
