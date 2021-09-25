
import * as Dacast from "../../types/dacast-types.js"

export function fakeDacastData() {

	function randomHex() {
		const lingo = "0123456789abcdef"
		const result: string[] = []
		for (let i = 0; i < 8; i++) {
			result.push(
				lingo[Math.floor(Math.random() * lingo.length)]
			)
		}
		return result.join("")
	}

	function fakeContent(): Dacast.Content {
		return {
			title: `Fake Title ${randomHex()}`,
			online: true,
			id: Math.random().toString(),
			thumbnail: "thumb.jpg",
			creation_date: "1999-12-25",
			start_date: "1999-12-31",
			end_date: "2000-01-01",
		}
	}

	return {
		channels: {
			"channel-1": fakeContent(),
			"channel-2": fakeContent(),
		},
		vods: {
			"vod-1": fakeContent(),
			"vod-2": fakeContent(),
		},
		playlist: {
			"playlist-1": fakeContent(),
			"playlist-2": fakeContent(),
		},
	}
}
