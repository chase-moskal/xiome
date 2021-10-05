
import {Dacast} from "../dacast/types/dacast-types.js"

export function dacastForVideosFeature(
		makeDacastClient: Dacast.MakeClient
	): Dacast.GetClient {

	return (apiKey: string) => makeDacastClient({apiKey})
}
