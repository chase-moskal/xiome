
import {Dacast} from "../../types/dacast-types.js"
import {DacastData} from "../../types/dacast-data.js"

export function mockDacastClient({goodApiKey}: {
		goodApiKey: string
	}): Dacast.MakeClient {

	let count = 1

	function fakeContent(type: string): DacastData.Common {
		const id = count++
		return {
			online: true,
			id: `${type}-${id.toString()}`,
			title: `content ${id}`,
			creation_date: "1999-12-25",
		}
	}

	function fakeEmbedCode(type: Dacast.EmbedType) {
		return type === "iframe"
			? `<iframe src="https://iframe.dacast.com/vod/0ffd60be-91b7-22b0-1353-7dba7af43261/e9cc39f7-83ea-19db-2c0e-672beeec1547" width="100%" height="100%" frameborder="0" scrolling="no" allow="autoplay" allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>`
			: `<script id="0ffd60be-91b7-22b0-1353-7dba7af43261-vod-e9cc39f7-83ea-19db-2c0e-672beeec1547" width="100%" height="100%" src="https://player.dacast.com/js/player.js?contentId=0ffd60be-91b7-22b0-1353-7dba7af43261-vod-e9cc39f7-83ea-19db-2c0e-672beeec1547"  class="dacast-video"></script>`
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
						get: fun(async() => ({code: fakeEmbedCode(embedType)})),
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
