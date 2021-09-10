
type Listener<Context> = (context: Context) => void

export function subbies<Context = undefined>() {
	const memory = new Map<symbol, Listener<Context>>()
	return {
		subscribe(listener: Listener<Context>) {
			const symbol = Symbol()
			memory.set(symbol, listener)
			return () => memory.delete(symbol)
		},
		publish: <Listener<Context>>(context => {
			for (const [,listener] of memory)
				listener(context)
		}),
		clear() {
			memory.clear()
		},
	}
}
