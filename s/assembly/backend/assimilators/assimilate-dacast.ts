
import {AssimilatorOptions} from "../types/assilimator-options.js"
import {Dacast} from "../../../features/videos/dacast/types/dacast-types.js"
import {goodApiKey} from "../../../features/videos/dacast/mocks/parts/mock-dacast-constants.js"
import {mockVerifyDacastApiKey} from "../../../features/videos/dacast/mocks/parts/mock-verify-dacast-api-key.js"
import {mockDacastSdk} from "../../../features/videos/dacast/mocks/mock-dacast-sdk.js"

export function assimilateDacast({
		config,
		configureDacast,
	}: AssimilatorOptions): Dacast.Sdk {

	if (config.dacast === "mock-mode")
		return mockDacastSdk({goodApiKey})

	else if (config.dacast === true)
		return configureDacast()

	else
		throw new Error("unknown dacast config")
}
