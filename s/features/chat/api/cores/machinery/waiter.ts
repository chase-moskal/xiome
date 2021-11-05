
export type Sniffer = (key: string, ...args: any[]) => boolean
export type DataParams = [string, ...any[]]
export type Resolver = (params: DataParams) => void

export function waiter() {
	let waiters = new Map<Resolver, Sniffer>()
	return {
		async waitForMessageFromServer<S extends Sniffer>(sniffer: S) {
			let resolve: Resolver
			const promise = new Promise<DataParams>(r => {
				resolve = r
			})
			waiters.set(resolve, sniffer)
			return promise
		},
		resolveWaiters(key: string, ...args: any[]) {
			for (const [resolve, sniffer] of waiters.entries()) {
				const isMatch = sniffer(key, ...args)
				if (isMatch) {
					resolve([key, ...args])
					waiters.delete(resolve)
				}
			}
		},
	}
}
