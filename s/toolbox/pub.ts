
export type Listener = (...args: any[]) => void | Promise<void>

export function pub<L extends Listener = () => void | Promise<void>>() {
	const records = new Map<symbol, L[]>()
	return {

		subscribe(...listeners: L[]) {
			if (listeners.length) {
				const id = Symbol()
				records.set(id, listeners)
				return () => {
					records.delete(id)
				}
			}
		},

		async publish(...args: Parameters<L>): Promise<void> {
			await Promise.all(
				Array.from(records.values())
					.flat()
					.map(listener => listener(...args))
			)
		},

		clear() {
			records.clear()
		},
	}
}
