
import {GetDacastClient} from "../../../features/videos/types/video-concepts.js"
import {makeDacastClient} from "../../../features/videos/dacast/make-dacast-client.js"

export function configureDacast(): GetDacastClient {
	return (apiKey: string) => makeDacastClient({apiKey})
}
