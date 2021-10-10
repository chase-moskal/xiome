
import {Dacast} from "../../../dacast/types/dacast-types.js"
import {VideoHosting} from "../../../types/video-concepts.js"

const embedType: Dacast.EmbedType = "iframe"

export async function getDacastEmbed({
		dacast, reference: {id, type},
	}: {
		dacast: Dacast.Client
		reference: VideoHosting.AnyReference
	}): Promise<Dacast.Embed> {

	switch (type) {
		case "vod": return dacast.vods.id(id).embed(embedType).get()
		case "channel": return dacast.channels.id(id).embed(embedType).get()
		case "playlist": return dacast.playlists.id(id).embed(embedType).get()
		default: throw new Error(`unknown dacast type "${type}"`)
	}
}
