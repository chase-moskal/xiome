
import {Api} from "renraku/x/types/api/api.js"
import {ToRemote} from "renraku/x/types/remote/to-remote.js"

import {objectMap} from "../toolbox/object-map.js"
import {Logger} from "../toolbox/logger/interfaces.js"

export function logAllCalls<xApi extends Api>({logger, fullyDebug, remote}: {
		logger: Logger
		fullyDebug: boolean
		remote: ToRemote<xApi>
	}): ToRemote<xApi> {

	let count = 1

	function recurse(remote: ToRemote<xApi>, path: string[] = []) {
		return objectMap(remote, (value, key) => {
			const currentPath = [...path, key]
			if (typeof value === "function") {
				return async(...args: any[]) => {
					const callNumber = count++
					const label = `#${callNumber} ${currentPath.join(".")}`

					if (fullyDebug)
						logger.log(label, ...args)
					else
						logger.log(label)

					const result = await value(...args)

					if (fullyDebug)
						logger.log(`    #${callNumber} return:`, result)

					return result
				}
			}
			else if (typeof (value ?? undefined) === "object")
				return recurse(value, currentPath)
			else
				throw new Error("unknown remote type")
		})
	}

	return recurse(remote)
}
