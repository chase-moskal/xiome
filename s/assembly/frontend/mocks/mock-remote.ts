
import {loopbackJsonRemote} from "renraku/x/remote/loopback-json-remote.js"
import {noServeletLogger} from "renraku/x/servelet/logger/no-servelet-logger.js"
import {makeJsonHttpServelet} from "renraku/x/servelet/make-json-http-servelet.js"

import {SystemApi} from "../../backend/types/system-api.js"
import {prepareApiShape} from "../auth/prepare-api-shape.js"
import {logAllCalls} from "../../../framework/log-all-calls.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"
import {addMockLatency, MockLatency} from "../../../framework/add-mock-latency.js"

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
		fullyDebug: false,
		remote: addMockLatency({
			latency,
			remote: loopbackJsonRemote<typeof api>({
				shape,
				link: apiLink,
				headers: {origin},
				servelet: makeJsonHttpServelet(api, noServeletLogger()),
			}),
		}),
	})

	const authMediator = installAuthMediator({
		greenService: remote.auth.greenService,
	})

	return {remote, authMediator}
}
