
type AsyncFunc = (...args: any[]) => Promise<any>

export class CircularError extends Error {
	name = this.constructor.name
	constructor() {
		super("infinite loop detected")
	}
}

export function forbidCircularity<F extends AsyncFunc>(func: F) {
	let circle = false
	return <F>async function(...args) {
		if (!circle) {
			circle = true
			const result = await func(...args)
			circle = false
			return result
		}
		else {
			throw new CircularError()
		}
	}
}
