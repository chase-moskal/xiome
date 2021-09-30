
import {AssimilatorOptions} from "../types/assilimator-options.js"
import {GetDacastClient} from "../../../features/videos/types/video-concepts.js"
import {mockDacastClient} from "../../../features/videos/dacast/mocks/mock-dacast-client.js"
import {goodApiKey} from "../../../features/videos/dacast/mocks/constants.js"

export function assimilateDacast({
		config,
		configureDacast,
	}: AssimilatorOptions): GetDacastClient {

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
