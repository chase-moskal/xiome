
export interface LoadingSelector<xPayload, xResult> {
	none: () => xResult
	loading: () => xResult
	error: (reason: string) => xResult
	ready: (payload: xPayload) => xResult
}
