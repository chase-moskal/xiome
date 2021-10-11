
import styles from "./xiome-video-display.css.js"
import {videoControls} from "./parts/controls/video-controls.js"
import {makeContentModel} from "../../models/parts/content-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ComponentWithShare, mixinStyles, html, property} from "../../../../framework/component/component.js"
import {VideoHosting} from "../../types/video-concepts.js"

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
		const map = new WeakMap<VideoHosting.AnyEmbed, HTMLDivElement>()
		return {
			obtain(details: VideoHosting.AnyEmbed) {
				let div = map.get(details)
				if (!div) {
					div = document.createElement("div")
					div.innerHTML = details.embed
					div.setAttribute("data-id", details.id)
					map.set(details, div)
				}
				return div
			},
		}
	})()

	#renderShow() {
		const show = this.model.getShow(this.label)
		return show?.details ? html`
			<p>show ${show.details.title}</p>
			${this.#embeds.obtain(show.details) ?? "(embed missing)"}
		` : html`
			<p>no show</p>
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
