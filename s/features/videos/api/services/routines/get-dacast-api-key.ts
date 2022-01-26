
import {VideoSchema} from "../../../types/video-schema.js"
import * as dbproxy from "../../../../../toolbox/dbproxy/dbproxy.js"

export async function getDacastApiKey(videoTables: dbproxy.SchemaToTables<VideoSchema>) {

	const link = await videoTables.dacastAccountLinks
		.readOne({conditions: false})

	return link
		? link.apiKey
		: undefined
}
