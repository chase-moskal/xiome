
import {Dacast} from "../../../features/videos/dacast/types/dacast-types.js"
import {makeDacastClient} from "../../../features/videos/dacast/make-dacast-client.js"

export function configureDacast(): Dacast.GetClient {
	return (apiKey: string) => makeDacastClient({apiKey})
}
