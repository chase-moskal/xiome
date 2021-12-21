
import {RenrakuHttpHeaders, renrakuMock, RenrakuMockLatency, waitForMockLatency, RenrakuSpike} from "renraku"

import {SystemApi} from "../../backend/types/system-api.js"
import {prepareApiShape} from "../auth/prepare-api-shape.js"
import {stopwatch} from "../../../toolbox/goodtimes/stopwatch.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"

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
		headers: RenrakuHttpHeaders
	}) {

	const {metaMap, installAuthMediator} = prepareApiShape({
		appId,
		storage,
	})

	let mockLatency: undefined | RenrakuMockLatency
	function setMockLatency(value: undefined | RenrakuMockLatency) {
		mockLatency = value
	}

	const spike: RenrakuSpike = async(method, func, ...params) => {
		const [mockTime] = await stopwatch(waitForMockLatency(mockLatency))
		const [executionTime, result] = await stopwatch(func(...params))
		if (logging)
			console.log(`📡 ${method}() ${executionTime}ms + mock ${mockTime}ms`)
		return result
	}

	const remote = renrakuMock({spike})
		.forApi(api)
		.withMetaMap(metaMap, async() => headers)

	const authMediator = installAuthMediator({
		greenService: remote.auth.users.greenService,
	})

	return {remote, authMediator, setMockLatency}
}
