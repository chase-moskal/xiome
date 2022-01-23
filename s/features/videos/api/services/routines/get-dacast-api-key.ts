
import {VideoSchema} from "../../../types/video-schema.js"
import * as Dacast from "../../../dacast/types/dacast-types.js"

export async function getDacastApiKey(videoTables: VideoSchema) {

	const link = await videoTables.dacastAccountLinks
		.one({conditions: false})

	return link
		? link.apiKey
		: undefined
}
