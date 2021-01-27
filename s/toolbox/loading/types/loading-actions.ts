
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
