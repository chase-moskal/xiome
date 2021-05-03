
import {loopbackJsonRemote} from "renraku/x/remote/loopback-json-remote.js"
import {makeJsonHttpServelet} from "renraku/x/servelet/make-json-http-servelet.js"

import {SystemApi} from "../../backend/types/system-api.js"
import {prepareApiShape} from "../auth/prepare-api-shape.js"
import {logAllCalls} from "../../../framework/log-all-calls.js"
import {DisabledLogger} from "../../../toolbox/logger/disabled-logger.js"
import {addMockLatency, MockLatency} from "../../../framework/add-mock-latency.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"

export function mockRemote({
		api,
		appId,
		origin,
		apiLink,
		latency,
		storage,
	}: {
		appId: string
		api: SystemApi
		origin: string
		apiLink: string
		latency: MockLatency
		storage: FlexStorage
	}) {

	const {shape, installAuthMediator} = prepareApiShape({
		appId,
		storage,
	})

	const remote = logAllCalls({
		// logger: new DisabledLogger(),
		logger: console,
		fullyDebug: true,
		remote: addMockLatency({
			latency,
			remote: loopbackJsonRemote<typeof api>({
				shape,
				link: apiLink,
				headers: {origin},
				servelet: makeJsonHttpServelet(api),
			}),
		}),
	})

	const authMediator = installAuthMediator({
		greenService: remote.auth.greenService,
	})

	return {remote, authMediator}
}
