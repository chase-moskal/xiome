
import styles from "./xiome-video-display.css.js"
import {prepareEmbeds} from "./parts/embeds/prepare-embeds.js"
import {videoControls} from "./parts/controls/video-controls.js"
import {makeContentModel} from "../../models/parts/content-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {Component, mixinStyles, html, property, mixinRequireShare} from "../../../../framework/component.js"

@mixinStyles(styles)
export class XiomeVideoDisplay extends mixinRequireShare<{
		contentModel: ReturnType<typeof makeContentModel>
	}>()(Component) {

	@property({type: String})
	label: string = "default"

	@property({type: Boolean, reflect: true})
	"mock-embed": boolean = false

	@property({type: Boolean, reflect: true})
	"show-title": boolean = false

	get #model() {
		return this.share.contentModel
	}

	#embeds = prepareEmbeds()

	#videoControls = (() => {
		const controls = videoControls({
			contentModel: this.#model,
			requestUpdate: () => this.requestUpdate(),
			queryAll: s => Array.from(this.shadowRoot.querySelectorAll(s)),
		})
		this.addSubscription(controls.subscribe)
		return controls
	})()

	async init() {
		await this.#model.initializeForVideo(this.label)
	}

	#renderShow() {
		const show = this.#model.getShow(this.label)
		return show
			? show.details
				? html`
					${this["show-title"]
						? html`<h4 part=title>${show.details.title}</h4>`
						: null}
					${this.#embeds
						.obtain(show.details, this["mock-embed"])
							?? "(embed missing)"}
					<slot></slot>
				`
				: html`<slot name=unprivileged></slot>`
			: html`<slot name=unavailable></slot>`
	}

	render() {
		return renderOp(this.#model.state.accessOp, () => html`
			${this.#model.allowance.canModerateVideos
				? this.#videoControls.render(this.label)
				: null}
			${this.#renderShow()}
		`)
	}
}

