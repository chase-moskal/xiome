
import {Dacast} from "../../../dacast/types/dacast-types.js"
import {VideoHosting} from "../../../types/video-concepts.js"
import {ingestDacastContent} from "./ingest-dacast-content.js"
import {concurrent} from "../../../../../toolbox/concurrent.js"

export async function getCatalog({dacast}: {
		dacast: Dacast.Client
	}) {

	const results = await concurrent({
		vods: dacast.vods.get(),
		channels: dacast.channels.get(),
		playlists: dacast.playlists.get(),
	})
	const convert = (
			type: VideoHosting.DacastType,
			contentFromDacast: Dacast.Content
		) => ingestDacastContent({
		type,
		contentFromDacast,
	})
	return [
		...results.vods.map(x => convert("vod", x)),
		...results.channels.map(x => convert("channel", x)),
		...results.playlists.map(x => convert("playlist", x)),
	]
}
