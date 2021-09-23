
import * as Dacast from "./types/dacast-types.js"

export const makeDacastClient: Dacast.MakeClient = ({apiKey}) => {

	const dacastApiUrl = "https://developer.dacast.com/"
	const rest = undefined

	return {
		channels: {
			get: async() => { throw new Error("todo") },
			id: channelId => ({
				get: async() => { throw new Error("todo") },
				embed: embedType => ({
					get: async() => { throw new Error("todo") },
				}),
			})
		},
		vods: {
			get: async() => { throw new Error("todo") },
			id: vodId => ({
				get: async() => { throw new Error("todo") },
				embed: embedType => ({
					get: async() => { throw new Error("todo") },
				}),
			})
		},
		playlists: {
			get: async() => { throw new Error("todo") },
			id: playlistsId => ({
				get: async() => { throw new Error("todo") },
				embed: embedType => ({
					get: async() => { throw new Error("todo") },
				}),
			})
		},
	}
}
