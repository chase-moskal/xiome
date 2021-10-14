
import {Dacast} from "../../../dacast/types/dacast-types.js"
import {VideoHosting} from "../../../types/video-concepts.js"
import {ingestDacastContent} from "./ingest-dacast-content.js"
import {concurrent} from "../../../../../toolbox/concurrent.js"
import {DacastData} from "../../../dacast/types/dacast-data.js"

export async function getCatalog({dacast}: {
		dacast: Dacast.Client
	}) {

	const results = await concurrent({
		vods: dacast.vods.get(),
		channels: dacast.channels.get(),
		playlists: dacast.playlists.get(),
	})

	function convert2(
			type: DacastData.ContentType,
			paginated: Dacast.Paginated<DacastData.Common>
		) {
		return (paginated?.data ?? []).map(data => ingestDacastContent({
			type,
			data,
		}))
	}

	return [
		...convert2("vod", results.vods),
		...convert2("channel", results.channels),
		...convert2("playlist", results.playlists),
	]
}
