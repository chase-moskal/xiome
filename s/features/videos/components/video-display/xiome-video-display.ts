
import styles from "./xiome-video-display.css.js"
import {VideoHosting} from "../../types/video-concepts.js"
import {videoControls} from "./parts/controls/video-controls.js"
import {makeContentModel} from "../../models/parts/content-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {parseDacastIframeSrc} from "../../dacast/utils/parse-dacast-iframe-src.js"
import {ComponentWithShare, mixinStyles, html, property} from "../../../../framework/component/component.js"

@mixinStyles(styles)
export class XiomeVideoDisplay extends ComponentWithShare<{
		contentModel: ReturnType<typeof makeContentModel>
	}> {

	@property({type: String})
	label: string = "default"

	get model() {
		return this.share.contentModel
	}

	#videoControls = (() => {
		const controls = videoControls({
			contentModel: this.model,
			requestUpdate: () => this.requestUpdate(),
			queryAll: s => Array.from(this.shadowRoot.querySelectorAll(s)),
		})
		this.addSubscription(controls.subscribe)
		return controls
	})()

	async init() {
		await this.model.initialize(this.label)
	}

	#embeds = (() => {
		const map = new Map<string, HTMLDivElement>()
		return {
			obtain(details: VideoHosting.AnyEmbed) {
				if (details.provider !== "dacast")
					throw new Error(`unsupported video provider "${details.provider}"`)
				let div = map.get(details.id)
				if (!div) {
					div = document.createElement("div")
					div.setAttribute("data-id", details.id)
					const iframe = document.createElement("iframe")
					iframe.src = parseDacastIframeSrc(details.embed)
					iframe.setAttribute("part", "iframe")
					div.appendChild(iframe)
					map.set(details.id, div)
				}
				return div
			},
		}
	})()

	#renderShow() {
		const show = this.model.getShow(this.label)
		return show?.details ? html`
			<slot name=title>${show.details.title}</slot>
			${this.#embeds.obtain(show.details) ?? "(embed missing)"}
			<slot></slot>
		` : html`
			<slot name=no-show></slot>
		`
	}

	render() {
		return renderOp(this.model.state.accessOp, () => html`
			${this.model.allowance.canModerateVideos
				? this.#videoControls.render(this.label)
				: null}
			${this.#renderShow()}
		`)
	}
}
