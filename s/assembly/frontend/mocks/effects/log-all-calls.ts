
// import * as renraku from "renraku"

// import {objectMap} from "../../../../toolbox/object-map.js"
// import {Logger} from "../../../../toolbox/logger/interfaces.js"

// export function logAllCalls<xApi extends renraku.Api>({logger, fullyDebug, remote}: {
// 		logger: Logger
// 		fullyDebug: boolean
// 		remote: renraku.Remote<xApi>
// 	}): renraku.Remote<xApi> {

// 	let count = 1

// 	function recurse(remote: renraku.Remote<xApi>, path: string[] = []) {
// 		return objectMap(remote, (value, key) => {
// 			const currentPath = [...path, key]
// 			if (typeof value === "function") {
// 				return async(...args: any[]) => {
// 					const callNumber = count++
// 					const label = `#${callNumber} ${currentPath.join(".")}`

// 					if (fullyDebug)
// 						logger.log(label, ...args)
// 					else
// 						logger.log(label)

// 					const result = await value(...args)

// 					if (fullyDebug)
// 						logger.log(`    #${callNumber} return:`, result)

// 					return result
// 				}
// 			}
// 			else if (typeof (value ?? undefined) === "object")
// 				return recurse(value, currentPath)
// 			else
// 				throw new Error("unknown remote type")
// 		})
// 	}

// 	return recurse(remote)
// }
