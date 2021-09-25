
import {DacastLinkDisplay, DacastLinkRow} from "../../../types/dacast-link.js"

export function mockDacastService({goodApiKey}: {
		goodApiKey: string
	}) {

	let link: DacastLinkRow

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
