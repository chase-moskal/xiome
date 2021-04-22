
import {forbidCircularity} from "./forbid-circularity.js"

export function onesie<F extends (...args: any[]) => Promise<any>>(operation: F) {
	let activeOperation: Promise<any>
	return forbidCircularity(<F>async function(...args) {
		if (activeOperation) return activeOperation
		else {
			activeOperation = operation(...args)
			const result = await activeOperation
			activeOperation = undefined
			return result
		}
	})
}
