
import * as Dacast from "../types/dacast-types.js"
import {fakeDacastContent} from "./parts/fake-dacast-content.js"

export function mockDacastClient({goodApiKey}: {
		goodApiKey: string
	}): Dacast.MakeClient {
	
	function fakeContentResource(type: string) {
		const content = [
			fakeDacastContent(type),
			fakeDacastContent(type),
		]
		const fakeEmbed = `fake-embed`
		return {
			get: async() => content,
			id: (contentId: string) => ({
				get: async() => content.find(c => c.id === contentId),
				embed: (embedType: Dacast.EmbedType) => ({
					get: async() => fakeEmbed
				}),
			}),
		}
	}

	const fake = {
		vods: fakeContentResource("vods"),
		channels: fakeContentResource("channels"),
		playlists: fakeContentResource("playlists"),
	}

	return ({apiKey}) => fake
}
