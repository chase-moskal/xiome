
import {Api} from "renraku/x/types/api/api.js"
import {ToRemote} from "renraku/x/types/remote/to-remote.js"

import {nap} from "../toolbox/nap.js"
import {objectMap} from "../toolbox/object-map.js"

export interface MockLatencyRange {
	min: number
	max: number
}

export type MockLatency = false | MockLatencyRange

export function addMockLatency<xApi extends Api>({latency, remote}: {
		latency: MockLatency
		remote: ToRemote<xApi>
	}): ToRemote<xApi> {

	function getRandomizedDelay() {
		if (latency === false) return 0
		const range = latency.max - latency.min
		const randomRange = Math.random() * range
		return latency.min + randomRange
	}

	function recurse(remote: ToRemote<xApi>) {
		return objectMap(remote, (value, key) => {
			if (typeof value === "function") {
				return async(...args: any[]) => {
					const delay = getRandomizedDelay()
					await nap(delay)
					return value(...args)
				}
			}
			else if (typeof (value ?? undefined) === "object")
				return recurse(value)
			else
				throw new Error("unknown remote type")
		})
	}

	return recurse(remote)
}
