
export function obtain<xResult>(
		object: {[key: string]: any},
		path: string[],
	): xResult {

	return path.reduce(
		(x, y) => x && x[y] || undefined,
		object,
	)
}
