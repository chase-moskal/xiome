
import {objectMap} from "../object-map.js"

export type LingoHandler = (...args: any) => Promise<void>
export type LingoHandlers = {[key: string]: LingoHandler}
export type LingoShape<xHandlers extends LingoHandlers> = {
	[P in keyof xHandlers]: true
}
export type LingoExecutor = (key: string, ...args: any[]) => Promise<void>
export type AsHandlers<xHandlers extends LingoHandlers> = xHandlers

export function lingoHost<xHandlers extends LingoHandlers>(
			expose: xHandlers
		) {
	return async function executeHandler(key: string, ...args: any[]) {
		const handler = expose[key]
		if (!handler)
			throw new Error(`unknown handler "${key}"`)
		else
			await handler(...args)
	}
}

export function lingoRemote<xHandlers extends LingoHandlers>({shape, send}: {
			shape: LingoShape<xHandlers>
			send: (key: string, ...args: any[]) => Promise<void>
		}) {
	return <xHandlers>objectMap(
		shape,
		(value, key) => (...args: any) => send(key, ...args),
	)
}
