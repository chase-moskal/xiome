
const _structured_clone = (
	(typeof window !== "undefined" ? window : global)?.structuredClone
)

export interface Cloner {
	<T>(x: T): T
}

export const clone: Cloner = (typeof _structured_clone === "function")
	? x => _structured_clone(x)
	: x => JSON.parse(JSON.stringify(x))
