
export function merge<T>(
		newItems: T[],
		oldItems: T[],
		compare: (a: T, b: T) => boolean
	) {
	const result: T[] = [...newItems]
	for (const oldItem of oldItems) {
		const included = !!result.find(newItem => compare(newItem, oldItem))
		if (!included)
			result.push(oldItem)
	}
	return result
}
