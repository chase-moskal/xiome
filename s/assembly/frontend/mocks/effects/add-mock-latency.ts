
import * as renraku from "renraku"

import {nap} from "../../../../toolbox/nap.js"
import {objectMap} from "../../../../toolbox/object-map.js"

export interface MockLatencyRange {
	min: number
	max: number
}

export type MockLatency = false | MockLatencyRange

export function addMockLatency<xApi extends renraku.Api>({latency, remote}: {
		latency: MockLatency
		remote: renraku.Remote<xApi>
	}): renraku.Remote<xApi> {

	function getRandomizedDelay() {
		if (latency === false) return 0
		const range = latency.max - latency.min
		const randomRange = Math.random() * range
		return latency.min + randomRange
	}

	function recurse(remote: renraku.Remote<xApi>) {
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
