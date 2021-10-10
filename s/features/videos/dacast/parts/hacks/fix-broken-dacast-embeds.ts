
import {Dacast} from "../../types/dacast-types.js"

const regex = {
	iframe: /"https:\/\/iframe\.dacast\.com\/(\S+)\/(\S+)\/(\S+)"/i,
	iframeBroken: /height="\d+\s/i,
}

export function fixBrokenDacastEmbeds({embed, embedType}: {
		embed: Dacast.Embed
		embedType: Dacast.EmbedType
	}) {

	if (embedType === "iframe") {
		const isBroken = regex.iframeBroken.test(embed.code)
		const iframe = embed.code.match(regex.iframe)

		if (isBroken && iframe) {
			const [, resource, id1, id2] = iframe
			const fixedResource = resource === "playlists"
				? "playlist"
				: resource
			return {
				code: `<iframe src="https://iframe.dacast.com/${fixedResource}/${id1}/${id2}" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>`,
			}
		}
	}

	return embed
}
