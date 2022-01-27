
import {VideoSchema} from "../../../types/video-schema.js"
import * as dbmage from "dbmage"

export async function getDacastApiKey(videoTables: dbmage.SchemaToTables<VideoSchema>) {

	const link = await videoTables.dacastAccountLinks
		.readOne({conditions: false})

	return link
		? link.apiKey
		: undefined
}
