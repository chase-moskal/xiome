
import * as Dacast from "../types/dacast-types.js"

export const goodApiKey = "a123"

const mockData = {
	channels: {
		"channel-1": {

		}
	},
}

export const mockDacastClient: Dacast.MakeClient = ({apiKey}) => ({
	channels: {
		get: () => (undefined),
	},
	channel: (id: string) => ({
		get: () => (undefined),
	}),
	vods: {
		get: () => (undefined),
	},
	vod: (id: string) => ({
		get: () => (undefined),
	}),
	playlists: {
		get: () => (undefined),
	},
	playlist: (id: string) => ({
		get: () => (undefined),
	}),
})
