
import {VideoHosting} from "../../../types/video-concepts.js"
import * as Dacast from "../../../dacast/types/dacast-types.js"

export function ingestDacastContent({
		type,
		contentFromDacast,
	}: {
		type: VideoHosting.DacastType,
		contentFromDacast: Dacast.Content,
	}): VideoHosting.DacastContent {

	return {
		type,
		id: contentFromDacast.id,
		title: contentFromDacast.title,
		thumb: contentFromDacast.thumbnail,
		provider: "dacast" as const,
	}
}
