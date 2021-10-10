
import {makeDacastSdk} from "../../../features/videos/dacast/make-dacast-sdk.js"
import {Dacast} from "../../../features/videos/dacast/types/dacast-types.js"

export function configureDacast(): Dacast.Sdk {
	return makeDacastSdk()
}
