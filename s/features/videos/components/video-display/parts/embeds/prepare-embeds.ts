
import {VideoHosting} from "../../../../types/video-concepts.js"
import {makeHtmlElement} from "../../../../../../toolbox/make-html-element.js"
import {parseDacastIframeSrc} from "../../../../dacast/utils/parse-dacast-iframe-src.js"

let mockCount = 0

export function prepareEmbeds() {
	const map = new Map<string, HTMLDivElement>()
	return {

		obtain(details: VideoHosting.AnyEmbed, mockEmbed: boolean) {
			if (details.provider !== "dacast")
				throw new Error(`unsupported video provider "${details.provider}"`)
			let div = map.get(details.id)
			if (!div) {
				div = makeHtmlElement("div", {
					"data-id": details.id,
				})
				const embed = mockEmbed
					? makeHtmlElement<HTMLImageElement>("img", {
						part: "iframe",
						alt: "",
						src: `https://source.unsplash.com/random/480x270?${mockCount++}`
					})
					: makeHtmlElement<HTMLIFrameElement>("iframe", {
						src: parseDacastIframeSrc(details.embed),
						part: "iframe",
						allowfullscreen: "",
						webkitallowfullscreen: "",
						mozallowfullscreen: "",
						oallowfullscreen: "",
						msallowfullscreen: "",
						frameborder: "0",
						scrolling: "no",
						allow: "autoplay",
					})
					
				div.appendChild(embed)
				map.set(details.id, div)
			}
			return div
		},
	}
}
