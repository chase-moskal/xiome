
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
}

export interface LoadingSelector<xPayload, xResult> {
	none: () => xResult
	loading: () => xResult
	error: (reason: string) => xResult
	ready: (payload: xPayload) => xResult
}

export interface LoadingView<xPayload> {
	readonly none: boolean
	readonly loading: boolean
	readonly error: boolean
	readonly ready: boolean
	readonly reason: string
	readonly payload: xPayload
	select<xResult>(selector: LoadingSelector<xPayload, xResult>): xResult
}

export function loading<xPayload>() {
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
		}
	}

	return {actions, view}
}
