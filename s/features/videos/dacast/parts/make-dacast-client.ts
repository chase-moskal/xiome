
import {Dacast} from "../types/dacast-types.js"
import {dacastRestModern} from "./rest/dacast-rest-modern.js"
import {dacastRestLegacy} from "./rest/dacast-rest-legacy.js"

export const makeDacastClient: Dacast.MakeClient = ({apiKey, headers = {}}) => {

	const modern = dacastRestModern({apiKey, headers})
	const legacy = dacastRestLegacy({apiKey, headers})

	return {
		channels: {
			get: legacy.get(`/v2/channel`),
			id: (channelId: string) => ({
				get: modern.get(`/v2/channel/${channelId}`),
				embed: (embedType: string) => ({
					get: modern.get(`v2/channel/${channelId}/embed/${embedType}`),
				}),
			})
		},
		vods: {
			get: modern.get(`/v2/vod`),
			id: (vodId: string) => ({
				get: modern.get(`/v2/vod/${vodId}`),
				embed: (embedType: string) => ({
					get: modern.get(`/v2/vod/${vodId}/embed/${embedType}`),
				}),
			})
		},
		playlists: {
			get: modern.get(`/v2/playlists`),
			id: (playlistsId: string) => ({
				get: modern.get(`/v2/playlists/${playlistsId}`),
				embed: (embedType: string) => ({
					get: modern.get(`/v2/playlists/${playlistsId}/embed/${embedType}`),
				}),
			})
		},
	}
}
