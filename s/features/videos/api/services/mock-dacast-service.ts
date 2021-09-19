
import {DacastLinkDisplay, DacastLinkSecret} from "../../types/dacast-link.js"

export function mockDacastService({goodApiKey}: {
		goodApiKey: string
	}) {

	let link: DacastLinkSecret

	function getLinkDisplay(): undefined | DacastLinkDisplay {
		return link
			? {time: link.time}
			: undefined
	}

	return {

		async getLink() {
			return getLinkDisplay()
		},

		async setLink(apiKey: string) {
			link = (apiKey === goodApiKey)
				? {apiKey, time: Date.now()}
				: undefined
			return getLinkDisplay()
		},

		async clearLink() {
			link = undefined
			return getLinkDisplay()
		},
	}
}
