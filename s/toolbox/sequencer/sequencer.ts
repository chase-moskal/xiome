
import {nap} from "../nap.js"
import {remotePromise} from "../remote-promise.js"

export function sequencer<F extends (...args: any[]) => Promise<any>>(
		fun: F
	): F {

	const queue: (() => Promise<void>)[] = []

	async function executeNext() {
		const next = queue[0]
		if (next) {
			next()
			await nap()
			queue.shift()
		}
	}

	return <F>(async(...args) => {
		const {promise, resolve, reject} = remotePromise()
		queue.push(async() => {
			try {
				resolve(await fun(...args))
			}
			catch (error) { reject(error) }
			finally {
				await nap()
				executeNext()
			}
		})
		if (queue.length === 1)
			executeNext()
		return promise
	})
}
