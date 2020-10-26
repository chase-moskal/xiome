
export function once<T extends any>(
	handler: () => Promise<T>
): () => Promise<T> {
	let done = false
	let value: T
	return async() => {
		if (done) return value
		else {
			value = await handler()
			done = true
			return value
		}
	}
}
