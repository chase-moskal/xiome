
import {Dacast} from "../types/dacast-types.js"
import {DacastData} from "../types/dacast-data.js"

export function mockDacastClient({goodApiKey}: {
		goodApiKey: string
	}): Dacast.MakeClient {

	let count = 1

	function fakeContent(type: string): DacastData.Common {
		const id = count++
		return {
			id: id.toString(),
			title: `content ${id}`,
			online: true,
			creation_date: "1999-12-25",
		}
	}

	const data = {
		vods: [0, 0].map(() => fakeContent("vod")),
		channels: [0, 0].map(() => fakeContent("channel")),
		playlists: [0, 0].map(() => fakeContent("playlist")),
	}

	return ({apiKey}) => {

		function resource<xData extends DacastData.Common>(content: xData[]) {

			function fun<F extends (...args: any[]) => any>(f: F) {
				return <F>((...args) => {
					if (apiKey !== goodApiKey)
						throw new Error("mock dacast invalid api key")
					return f(...args)
				})
			}

			function paginate(content: xData[]): Dacast.Paginated<xData> {
				return {
					totalCount: content.length.toString(),
					data: content,
					paging: {
						last: "",
						next: "",
						previous: "",
						self: "",
					},
				}
			}

			return {
				get: fun(async() => paginate(content)),
				id: (contentId: string) => ({
					get: fun(async() => content.find(c => c.id === contentId)),
					embed: (embedType: Dacast.EmbedType) => ({
						get: fun(async() => `fake-embed`),
					}),
				}),
			}
		}

		return {
			vods: resource(data.vods as DacastData.Vod[]),
			channels: resource(data.channels as DacastData.Channel[]),
			playlists: resource(data.playlists as DacastData.Playlist[]),
		}
	}
}
