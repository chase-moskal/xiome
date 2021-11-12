
export type LingoHandler = (...args: any) => void | Promise<void>
export type LingoHandlers = {[key: string]: LingoHandler}

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

export function lingoRemote<xHandlers extends LingoHandlers>({send}: {
			send: (key: string, ...args: any[]) => void | Promise<void>
		}) {
	return <xHandlers>new Proxy({}, {
		set: () => {throw new Error("cannot write to lingo remote")},
		get: (target, property: string, receiver) => (...args: any[]) => {
			if (typeof property !== "string")
				throw new Error("lingo key must be string")
			return send(property, ...args)
		}
	})
}
