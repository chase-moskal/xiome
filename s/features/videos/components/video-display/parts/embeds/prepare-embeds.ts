
import {VideoHosting} from "../../../../types/video-concepts.js"
import {makeHtmlElement} from "../../../../../../toolbox/make-html-element.js"
import {parseDacastIframeSrc} from "../../../../dacast/utils/parse-dacast-iframe-src.js"

export function prepareEmbeds() {
	const map = new Map<string, HTMLDivElement>()
	return {

		obtain(details: VideoHosting.AnyEmbed) {
			if (details.provider !== "dacast")
				throw new Error(`unsupported video provider "${details.provider}"`)
			let div = map.get(details.id)
			if (!div) {
				div = makeHtmlElement("div", {
					"data-id": details.id,
				})
				const iframe = makeHtmlElement<HTMLIFrameElement>("iframe", {
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
				div.appendChild(iframe)
				map.set(details.id, div)
			}
			return div
		},
	}
}
