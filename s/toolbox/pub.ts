
export type Listener = (...args: any[]) => void | Promise<void>

export function pub<L extends Listener = () => void | Promise<void>>() {
	const listeners = new Map<symbol, L>()
	return {

		subscribe(listener: L) {
			const id = Symbol()
			listeners.set(id, listener)
			return () => {
				listeners.delete(id)
			}
		},

		async publish(...args: Parameters<L>): Promise<void> {
			await Promise.all(
				Array.from(listeners.values())
					.map(listener => listener(...args))
			)
		},

		clear() {
			listeners.clear()
		},
	}
}
