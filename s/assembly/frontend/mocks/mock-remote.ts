
import * as renraku from "renraku"

import {SystemApi} from "../../backend/types/system-api.js"
import {prepareApiShape} from "../auth/prepare-api-shape.js"
import {stopwatch} from "../../../toolbox/goodtimes/stopwatch.js"
import {FlexStorage} from "dbmage"

export function mockRemote({
		api,
		appId,
		storage,
		headers,
		logging,
	}: {
		appId: string
		api: SystemApi
		logging: boolean
		storage: FlexStorage
		headers: renraku.HttpHeaders
	}) {

	const {metaMap, installAuthMediator} = prepareApiShape({
		appId,
		storage,
	})

	let mockLatency: undefined | renraku.MockLatency
	function setMockLatency(value: undefined | renraku.MockLatency) {
		mockLatency = value
	}

	const spike: renraku.Spike = async(method, func, ...params) => {
		const [mockTime] = await stopwatch(renraku.waitForMockLatency(mockLatency))
		const [executionTime, result] = await stopwatch(func(...params))
		if (logging)
			console.log(`📡 ${method}() ${executionTime}ms + mock ${mockTime}ms`)
		return result
	}

	const remote = renraku.mock({spike})
		.forApi(api)
		.withMetaMap(metaMap, async() => headers)

	const authMediator = installAuthMediator({
		greenService: remote.auth.users.greenService,
	})

	return {remote, authMediator, setMockLatency}
}
