
export function hatPuller<T>(items: T[]) {
	let hat: T[] = []

	return function pick(): T {
		if (hat.length === 0) hat = [...items]
		const index = Math.floor(Math.random() * hat.length)
		const item = hat[index]
		hat.splice(index, 1)
		return item
	}
}
