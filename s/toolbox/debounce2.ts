
export function debounce2<xAction extends (...args: any[]) => void>(
		delay: number,
		action: xAction
	): xAction {

	let latestArgs: any[]
	let timeout: any

	return <xAction>((...args) => {
		latestArgs = args
		if (!timeout) {
			const operation = () => {
				action(...latestArgs)
				timeout = undefined
			}
			timeout = setTimeout(operation, delay)
		}
	})
}

export type AnyFunction = (...args: any[]) => any
export type Debounce3Return<xAction extends AnyFunction> = (...args: Parameters<xAction>) => ReturnType<xAction> extends Promise<any> ? ReturnType<xAction> : Promise<ReturnType<xAction>>

export function debounce3<xAction extends AnyFunction>(
		delay: number,
		action: xAction,
	): Debounce3Return<xAction> {

	let latestArgs: any[]
	let timeout: any
	let promise: Promise<ReturnType<xAction>>
	let resolve: (r: ReturnType<xAction>) => void
	let reject: (reason: any) => void

	function reset() {
		latestArgs = undefined
		timeout = undefined
		promise = new Promise((res, rej) => {
			resolve = res
			reject = rej
		})
	}

	reset()

	return <Debounce3Return<xAction>>((...args) => {
		latestArgs = args

		if (!timeout) {
			const operation = () => {
				timeout = undefined
				Promise.resolve(action(...latestArgs))
					.then(r => {
						if (!timeout)
							resolve(r)
					})
					.catch(err => {
						if (!timeout)
							reject(err)
					})
					.finally(() => {
						if (!timeout)
							reset()
					})
			}
			timeout = setTimeout(operation, delay)
		}

		return promise
	})
}
