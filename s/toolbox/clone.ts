
const isSupported = "structuredClone" in window
	&& typeof window.structuredClone === "function"

export interface Cloner {
	<T>(x: T): T
}

export const clone: Cloner = isSupported
	? x => window.structuredClone(x)
	: x => JSON.parse(JSON.stringify(x))
