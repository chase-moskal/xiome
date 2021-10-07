
import {AnyFunction, DebounceReturn} from "./debounce-types.js"

export function debounce<xAction extends AnyFunction>(
		delay: number,
		action: xAction,
	): DebounceReturn<xAction> {

	let latestArgs: any[]
	let timeout: any
	let promise: Promise<ReturnType<xAction>>
	let resolve: (r: ReturnType<xAction>) => void
	let reject: (reason: any) => void

	function reset() {
		latestArgs = undefined
		if (timeout)
			clearTimeout(timeout)
		timeout = undefined
		promise = new Promise((res, rej) => {
			resolve = res
			reject = rej
		})
	}

	reset()

	return <DebounceReturn<xAction>>((...args) => {
		latestArgs = args

		if (timeout)
			clearTimeout(timeout)

		timeout = setTimeout(() => {
			Promise.resolve(action(...latestArgs))
				.then(r => resolve(r))
				.catch(err => reject(err))
				.finally(() => reset())
		}, delay)

		return promise
	})
}
