
export function sequencer<F extends (...args: any[]) => Promise<any>>(
		fun: F
	): F {
	let promiseChain: Promise<any> = Promise.resolve()
	return <F>(async(...args: any[]) => {
		const next = promiseChain.then(() => fun(...args))
		promiseChain = next.catch(() => {})
		return next
	})
}
