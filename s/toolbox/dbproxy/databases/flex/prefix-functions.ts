
import {objectMap} from "../../../object-map.js"

export function prefixFunctions<
		xFunctions extends {[key: string]: (...args: any[]) => Promise<any>}
	>(
		prefix: () => Promise<void>,
		functions: xFunctions
	): xFunctions {

	return <xFunctions>objectMap(functions, fun => async(...args: any[]) => {
		await prefix()
		return fun(...args)
	})
}
