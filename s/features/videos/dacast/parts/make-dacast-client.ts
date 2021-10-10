
import {Dacast} from "../types/dacast-types.js"
import {dacastRestModern} from "./rest/dacast-rest-modern.js"
import {dacastRestLegacy} from "./rest/dacast-rest-legacy.js"
import {QueryData} from "../../../../toolbox/make-query-string.js"
import {fixBrokenDacastEmbeds} from "./hacks/fix-broken-dacast-embeds.js"

export const makeDacastClient: Dacast.MakeClient = ({apiKey, headers = {}}) => {

	const modern = dacastRestModern({apiKey, headers})
	const legacy = dacastRestLegacy({apiKey, headers})

	const hacks = {
		getEmbed: (
			(embedType: Dacast.EmbedType, restResource: string) =>
				async(query?: QueryData) => {
					const embed = await modern.get(restResource)(query) as Dacast.Embed
					return fixBrokenDacastEmbeds({embed, embedType})
				}
		),
	}

	return {
		channels: {
			get: legacy.get(`/v2/channel`),
			id: channelId => ({
				get: modern.get(`/v2/channel/${channelId}`),
				embed: embedType => ({
					get: hacks.getEmbed(embedType, `/v2/channel/${channelId}/embed/${embedType}`)
				})
			})
		},
		vods: {
			get: modern.get(`/v2/vod`),
			id: vodId => ({
				get: modern.get(`/v2/vod/${vodId}`),
				embed: embedType => ({
					get: hacks.getEmbed(embedType, `/v2/vod/${vodId}/embed/${embedType}`)
				}),
			})
		},
		playlists: {
			get: modern.get(`/v2/playlists`),
			id: playlistId => ({
				get: modern.get(`/v2/playlists/${playlistId}`),
				embed: embedType => ({
					get: hacks.getEmbed(embedType, `/v2/playlists/${playlistId}/embed/${embedType}`),
				}),
			})
		},
	}
}
