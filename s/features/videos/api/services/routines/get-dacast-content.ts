
import {RenrakuError} from "renraku"

import {Dacast} from "../../../dacast/types/dacast-types.js"
import {VideoHosting} from "../../../types/video-concepts.js"
import {DacastData} from "../../../dacast/types/dacast-data.js"

export async function getDacastContent({
		dacast,
		reference: {provider, type, id},
	}: {
		dacast: Dacast.Client
		reference: VideoHosting.DacastReference
	}): Promise<DacastData.Common> {

	if (provider !== "dacast")
		throw new RenrakuError(500, `video content provider mismatch (expected "dacast", got "${provider}")`)

	switch (type) {
		case "vod": return dacast.vods.id(id).get()
		case "channel": return dacast.channels.id(id).get()
		case "playlist": return dacast.playlists.id(id).get()
		default: throw new RenrakuError(500, `unknown dacast type "${type}"`)
	}
}
