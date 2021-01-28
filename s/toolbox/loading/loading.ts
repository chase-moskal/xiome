
import {Mode} from "./types/mode.js"
import {Loading} from "./types/loading.js"
import {mobxify} from "../../framework/mobxify.js"
import {LoadingView} from "./types/loading-view.js"
import {LoadingMode} from "./types/loading-mode.js"
import {LoadingActions} from "./types/loading-actions.js"
import {LoadingSelector} from "./types/loading-selector.js"
import { makeAutoObservable, action } from "mobx"

export function loading<xPayload>(): Loading<xPayload> {
	const state = makeAutoObservable({
		mode: <Mode>Mode.None,
		payload: <xPayload>undefined,
		reason: <string>undefined,
		set: ({mode, payload, reason}: {
				mode: Mode
				payload: xPayload
				reason: string
			}) => {
			state.mode = mode
			state.payload = payload
			state.reason = reason
		},
	})

	const actions: LoadingActions<xPayload> = {
		setNone() {
			state.set({
				mode: Mode.None,
				payload: undefined,
				reason: undefined,
			})
		},
		setLoading() {
			state.set({
				mode: Mode.Loading,
				payload: undefined,
				reason: undefined,
			})
		},
		setError(reason: string) {
			state.set({
				reason,
				mode: Mode.Error,
				payload: undefined,
			})
		},
		setReady(payload: xPayload) {
			state.set({
				payload,
				mode: Mode.Ready,
				reason: undefined,
			})
		},
		async setLoadingUntil({promise, errorReason}: {
				promise: Promise<xPayload>
				errorReason: string
			}): Promise<xPayload> {
			actions.setLoading()
			try {
				const payload = await promise
				actions.setReady(payload)
				return payload
			}
			catch (error) {
				actions.setError(errorReason)
				console.error(error)
			}
		},
	}

	const view: LoadingView<xPayload> = {
		get none() {
			return state.mode === Mode.None
		},
		get loading() {
			return state.mode === Mode.Loading
		},
		get error() {
			return state.mode === Mode.Error
		},
		get ready() {
			return state.mode === Mode.Ready
		},
		get reason() {
			return state.mode === Mode.Error
				? state.reason
				: undefined
		},
		get payload() {
			return state.mode === Mode.Ready
				? state.payload
				: undefined
		},
		select<xResult>(selector: LoadingSelector<xPayload, xResult>) {
			switch (state.mode) {
				case Mode.None: return selector.none()
				case Mode.Loading: return selector.loading()
				case Mode.Error: return selector.error(state.reason)
				case Mode.Ready: return selector.ready(state.payload)
			}
		},
		get mode() {
			return view.select<LoadingMode>({
				none: () => "none",
				loading: () => "loading",
				error: () => "error",
				ready: () => "ready",
			})
		},
	}

	return {actions, view}
}
