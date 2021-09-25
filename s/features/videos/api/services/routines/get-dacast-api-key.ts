
import {VideoTables} from "../../../types/video-tables.js"
import * as Dacast from "../../../dacast/types/dacast-types.js"

export async function getDacastApiKey(videoTables: VideoTables) {

	const link = await videoTables.dacastAccountLinks
		.one({conditions: false})

	return link
		? link.apiKey
		: undefined
}
