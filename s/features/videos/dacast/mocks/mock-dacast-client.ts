
import {Dacast} from "../types/dacast-types.js"

export function mockDacastClient({goodApiKey}: {
		goodApiKey: string
	}): Dacast.MakeClient {

	let count = 1

	function fakeContent(type: string): Dacast.Content {
		const id = count++
		return {
			id: id.toString(),
			title: `content ${id}`,
			online: true,
			thumbnail: "thumb.jpg",
			creation_date: "1999-12-25",
			start_date: "1999-12-31",
			end_date: "2000-01-01",
		}
	}

	const data = {
		vods: [0, 0].map(() => fakeContent("vod")),
		channels: [0, 0].map(() => fakeContent("channel")),
		playlists: [0, 0].map(() => fakeContent("playlist")),
	}

	return ({apiKey}) => {
		function resource(content: Dacast.Content[]) {
			function fun<F extends (...args: any[]) => any>(f: F) {
				return <F>((...args) => {
					if (apiKey !== goodApiKey)
						throw new Error("mock dacast invalid api key")
					return f(...args)
				})
			}
			return {
				get: fun(async() => content),
				id: (contentId: string) => ({
					get: fun(async() => content.find(c => c.id === contentId)),
					embed: (embedType: Dacast.EmbedType) => ({
						get: fun(async() => `fake-embed`),
					}),
				}),
			}
		}
		return {
			vods: resource(data.vods),
			channels: resource(data.channels),
			playlists: resource(data.playlists),
		}
	}
}
