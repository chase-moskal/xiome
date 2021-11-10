
type Listener<Context> = (context: Context) => void

export interface Subbie<Context = undefined> {
	subscribe(listener: Listener<Context>): () => void
	publish: Listener<Context>
	clear(): void
}

export function subbies<Context = undefined>(): Subbie<Context> {
	const memory = new Map<symbol, Listener<Context>>()
	return {
		subscribe(listener: Listener<Context>) {
			const symbol = Symbol()
			memory.set(symbol, listener)
			return () => {
				memory.delete(symbol)
			}
		},
		publish: (context => {
			for (const [,listener] of memory)
				listener(context)
		}),
		clear() {
			memory.clear()
		},
	}
}
