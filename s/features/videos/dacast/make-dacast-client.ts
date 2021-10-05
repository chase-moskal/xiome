
import {Dacast} from "./types/dacast-types.js"
import {RestClient} from "typed-rest-client/RestClient.js"

export const makeDacastClient: Dacast.MakeClient= ({
		apiKey,
		headers: moreHeaders = {}
	}) => {

	const headers: Dacast.Headers = {
		"X-Api-Key": apiKey,
		"X-Format": "default",
		...moreHeaders,
	}

	const dacastApiUrl = "https://developer.dacast.com"
	const rest = new RestClient("xiome", dacastApiUrl, undefined, {headers})
	
	const get = async<R>(url: string) => (await rest.get<R>(url)).result

	return {
		channels: {
			get: async() => get<Dacast.Channel[]>(`/v2/channel`),
			id: (channelId: string) => ({
				get: async() => get<Dacast.Channel>(`/v2/channel/${channelId}`),
				embed: (embedType: string) => ({
					get: async() => get<Dacast.Embed>(`v2/channel/${channelId}/embed/${embedType}`),
				}),
			})
		},
		vods: {
			get: async() => get<Dacast.Vod[]>(`/v2/vod`),
			id: (vodId: string) => ({
				get: async() => get<Dacast.Vod>(`/v2/vod/${vodId}`),
				embed: (embedType: string) => ({
					get: async() => get<Dacast.Embed>(`/v2/vod/${vodId}/embed/${embedType}`),
				}),
			})
		},
		playlists: {
			get: async() => get<Dacast.Playlist[]>(`/v2/playlists`),
			id: (playlistsId: string) => ({
				get: async() => get<Dacast.Playlist>(`/v2/playlists/${playlistsId}`),
				embed: (embedType: string) => ({
					get: async() => get<Dacast.Embed>(`/v2/playlists/${playlistsId}/embed/${embedType}`),
				}),
			})
		},
	}
}
