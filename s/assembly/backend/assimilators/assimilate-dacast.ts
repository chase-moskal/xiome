
import {AssimilatorOptions} from "../types/assilimator-options.js"
import {goodApiKey} from "../../../features/videos/dacast/mocks/constants.js"
import {mockDacastClient} from "../../../features/videos/dacast/mocks/mock-dacast-client.js"
import {Dacast} from "../../../features/videos/dacast/types/dacast-types.js"

export function assimilateDacast({
		config,
		configureDacast,
	}: AssimilatorOptions): Dacast.GetClient {

	if (config.dacast === "mock-mode") {
		return (apiKey: string) =>
			mockDacastClient({goodApiKey})({apiKey})
	}
	else if (config.dacast === true) {
		return configureDacast()
	}
	else {
		throw new Error("unknown dacast config")
	}
}
