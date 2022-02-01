
/**
 * return a value within an object tree, found at the given path.
 */
export function obtain<xResult>(
		object: {[key: string]: any},
		path: string[],
	): xResult {

	return path.reduce(
		(x, y) => (x !== undefined && x[y]) ?? undefined,
		object,
	)
}
