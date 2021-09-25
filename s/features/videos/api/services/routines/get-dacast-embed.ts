
import * as Dacast from "../../../dacast/types/dacast-types.js"
import {DacastType, VideoView} from "../../../types/video-concepts.js"

const embedType: Dacast.EmbedType = "javascript"

export async function getDacastEmbed({
		id, type, dacast,
	}: {
		id: string
		type: DacastType
		dacast: Dacast.Client
	}): Promise<Dacast.Embed> {

	switch (type) {
		case "vod":
			return dacast.vods.id(id).embed(embedType).get()
		case "channel":
			return dacast.channels.id(id).embed(embedType).get()
		case "playlist":
			return dacast.playlists.id(id).embed(embedType).get()
		default:
			throw new Error(`unknown dacast type "${type}"`)
	}
}
