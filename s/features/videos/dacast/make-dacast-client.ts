import * as rm from 'typed-rest-client/RestClient'
import * as Dacast from './types/dacast-types.js'

export const makeDacastClient: Dacast.MakeClient= (apiKey, options = {additionalHeaders: {'X-Api-Key': apiKey, 'X-Format': 'default'}}) => {
	const dacastApiUrl = 'https://developer.dacast.com/'
	const rest = new rm.RestClient('dacast-rest-api', dacastApiUrl);
	return {
		channels: {
			get: async() => (await rest.get<Dacast.Channel[]>(`v2/channel`, options)).result!,
			id: (channelId: string) => ({
				get: async() => (await rest.get<Dacast.Channel>(`v2/channel/${channelId}`, options)).result!,
				embed: (embedType: string) => ({
					get: async() => (await rest.get<Dacast.Embed>(`v2/channel/${channelId}/embed/${embedType}`, options)).result!
				}),
			})
		},
		vods: {
			get: async() => (await rest.get<Dacast.Vod[]>(`v2/vod`, options)).result!,
			id: (vodId: string) => ({
				get: async() => (await rest.get<Dacast.Vod>(`v2/vod/${vodId}`, options)).result!,
				embed: (embedType: string) => ({
					get: async() => (await rest.get<Dacast.Embed>(`v2/vod/${vodId}/embed/${embedType}`, options)).result!,
				}),
			})
		},
		playlists: {
			get: async() => (await rest.get<Dacast.Playlist[]>(`v2/playlists`, options)).result!,
			id: (playlistsId: string) => ({
				get: async() => (await rest.get<Dacast.Playlist>(`v2/playlists/${playlistsId}`, options)).result!,
				embed: (embedType: string) => ({
					get: async() => (await rest.get<Dacast.Embed>(`v2/playlists/${playlistsId}/embed/${embedType}`, options)).result!,
				}),
			})
		},
	}
}
