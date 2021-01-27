
import { autorun } from "mobx"
import {mobxify} from "../framework/mobxify.js"

export enum Mode {
	None,
	Loading,
	Error,
	Ready,
}

export interface LoadingActions<xPayload> {
	setNone(): void
	setLoading(): void
	setError(reason: string): void
	setReady(payload: xPayload): void
	setLoadingUntil({}: {
		promise: Promise<xPayload>
		errorReason: string
	}): Promise<xPayload>
}

export interface LoadingSelector<xPayload, xResult> {
	none: () => xResult
	loading: () => xResult
	error: (reason: string) => xResult
	ready: (payload: xPayload) => xResult
}

export type LoadingMode = "none" | "loading" | "error" | "ready"

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

export interface Loading<xPayload> {
	view: LoadingView<xPayload>
	actions: LoadingActions<xPayload>
}

export function loading<xPayload>(): Loading<xPayload> {
	const state = mobxify({
		mode: <Mode>Mode.None,
		payload: <xPayload>undefined,
		reason: <string>undefined,
		set({mode, payload, reason}: {
				mode: Mode
				payload: xPayload
				reason: string
			}) {
			this.mode = mode
			this.payload = payload
			this.reason = reason
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

export function metaLoadingView({subloading, errorReason}: {
		subloading: Loading<any>[]
		errorReason: string
	}): LoadingView<undefined> {
	const composite = loading<undefined>()
	autorun(() => {
		let allNone = true
		let allReady = true
		let anyError = false
		for (const sub of subloading) {
			allNone = allNone && sub.view.none
			allReady = allReady && sub.view.ready
			anyError = anyError || sub.view.error
		}
		if (allNone) {
			composite.actions.setNone()
		}
		else if (allReady) {
			composite.actions.setReady(undefined)
		}
		else if (anyError) {
			composite.actions.setError(errorReason)
		}
		else {
			composite.actions.setLoading()
		}
	})
	return composite.view
}
