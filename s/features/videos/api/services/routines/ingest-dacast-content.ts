
import {VideoHosting} from "../../../types/video-concepts.js"
import {DacastData} from "../../../dacast/types/dacast-data.js"

export function ingestDacastContent({
		type,
		data,
	}: {
		type: DacastData.ContentType,
		data: DacastData.Common,
	}): VideoHosting.DacastContent {

	const pictures = (data.pictures ?? [])
	const picture = pictures[0]
	const thumb = picture
		? (picture.thumbnail ?? [])[0]
		: undefined

	return {
		type,
		thumb,
		id: data.id,
		title: data.title,
		provider: "dacast" as const,
	}
}
