import * as rm from 'typed-rest-client/RestClient'
import * as Dacast from './types/dacast-types.js'

export const makeDacastClient: Dacast.MakeClient= (apiKey, options = {additionalHeaders: {'X-Api-Key': apiKey, 'X-Format': 'default'}}) => {
	const dacastApiUrl = 'https://developer.dacast.com/'
	const rest = new rm.RestClient('dacast-rest-api', dacastApiUrl);
	return {
		channels: {
			get: async() => (await rest.get<Dacast.Channel[]>(`v2/channel`, options)).result!,
			post: async(channel: any) => (await rest.create<Dacast.Channel>(`v2/channel`, channel, options)).result!,
			id: (channelId: string) => ({
				delete: async() => (await rest.del(`v2/channel/${channelId}`, options)).result,
				get: async() => (await rest.get<Dacast.Channel>(`v2/channel/${channelId}`, options)).result!,
				put: async() => (await rest.replace<Dacast.Channel>(`v2/channel/${channelId}`, options)).result!,
				embed: (embedType: string) => ({
					get: async() => (await rest.get<Dacast.Embed>(`v2/channel/${channelId}/embed/${embedType}`, options)).result!
				}),
				deleteSplash: async() => (await rest.del(`v2/channel/${channelId}/splash`, options)).result,
				postSplash: async() => (await rest.create<Dacast.Channel>(`v2/channel/${channelId}/splash`, options)).result!,
				deleteThumbnail: async() => (await rest.del(`v2/channel/${channelId}/thumbnail`, options)).result,
				postThumbnail: async() => (await rest.create<Dacast.Channel>(`v2/channel/${channelId}/thumbnail`, options)).result!,
			})
		},
		vods: {
			get: async() => (await rest.get<Dacast.Vod[]>(`v2/vod`, options)).result!,
			post: async(vod: any)=> (await rest.create<Dacast.Vod>(`v2/vod`, vod, options)).result!,
			id: (vodId: string) => ({
				get: async() => (await rest.get<Dacast.Vod>(`v2/vod/${vodId}`, options)).result!,
				delete: async() => (await rest.del(`v2/vod/${vodId}`, options)).result,
				put: async(vod: any) => (await rest.replace<Dacast.Vod>(`v2/vod/${vodId}`, vod, options)).result!,
				embed: (embedType: string) => ({
					get: async() => (await rest.get<Dacast.Embed>(`v2/vod/${vodId}/embed/${embedType}`, options)).result!,
				}),
				deleteSplash: async() => (await rest.del(`v2/vod/${vodId}/splash`, options)).result,
				postSplash: async(splash: any) => (await rest.create<Dacast.Vod>(`v2/vod/${vodId}/splash`, splash, options)).result!,
				postThumbnail: async(thumbnail: any) => (await rest.create<Dacast.Vod>(`v2/vod/${vodId}/thumbnail`, thumbnail, options)).result!,
			})
		},
		playlists: {
			get: async() => (await rest.get<Dacast.Playlist[]>(`v2/playlists`, options)).result!,
			post: async(playlist: any) => (await rest.create<Dacast.Playlist>(`v2/playlists`, playlist, options)).result!,
			id: (playlistsId: string) => ({
				delete: async() => (await rest.del(`v2/playlists/${playlistsId}`, options)).result,
				get: async() => (await rest.get<Dacast.Playlist>(`v2/playlists/${playlistsId}`, options)).result!,
				put: async(playlist: any) => (await rest.replace<Dacast.Playlist>(`v2/playlists/${playlistsId}`, playlist, options)).result!,
				putContent: async(content: any) => (await rest.replace<Dacast.Playlist>(`v2/playlists/${playlistsId}/content`, content, options)).result!,
				embed: (embedType: string) => ({
					get: async() => (await rest.get<Dacast.Embed>(`v2/playlists/${playlistsId}/embed/${embedType}`, options)).result!,
				}),
				deleteSplash: async() => (await rest.del(`v2/playlists/${playlistsId}/splash`, options)).result,
				postSplash: async(splash: any) => (await rest.create<Dacast.Playlist>(`v2/playlists/${playlistsId}/splash`, splash, options)).result!,
				deleteThumbnail: async() => (await rest.del(`v2/playlists/${playlistsId}/thumbnail`, options)).result,
				postThumbnail: async(thumbnail: any) => (await rest.create<Dacast.Playlist>(`v2/playlists/${playlistsId}/thumbnail`, thumbnail, options)).result!,
			})
		},
	}
}
