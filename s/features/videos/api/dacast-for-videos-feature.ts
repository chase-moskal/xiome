
import * as Dacast from "../dacast/types/dacast-types.js"
import {GetDacastClient} from "../types/video-concepts.js"

export function dacastForVideosFeature(
		makeDacastClient: Dacast.MakeClient
	): GetDacastClient {

	return (apiKey: string) => makeDacastClient({apiKey})
}
