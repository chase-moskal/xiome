
import * as Dacast from "../types/dacast-types.js"
import {fakeDacastData} from "./parts/fake-dacast-data.js"

export function mockDacastClient({goodApiKey}: {
		goodApiKey: string
	}): Dacast.MakeClient {

	const data = fakeDacastData()

	return ({apiKey}) => ({
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
	})
}
