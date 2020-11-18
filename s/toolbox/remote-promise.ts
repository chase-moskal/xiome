
export function remotePromise<Result extends any>() {
	let resolve: (result: Result) => void
	let reject: (error: Error) => void
	const promise = new Promise<Result>((resolve2, reject2) => {
		reject = reject2
		resolve = resolve2
	})
	return {promise, resolve, reject}
}
