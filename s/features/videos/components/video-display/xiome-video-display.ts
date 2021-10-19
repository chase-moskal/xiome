
import styles from "./xiome-video-display.css.js"
import {prepareEmbeds} from "./parts/embeds/prepare-embeds.js"
import {videoControls} from "./parts/controls/video-controls.js"
import {makeContentModel} from "../../models/parts/content-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ComponentWithShare, mixinStyles, html, property} from "../../../../framework/component.js"

@mixinStyles(styles)
export class XiomeVideoDisplay extends ComponentWithShare<{
		contentModel: ReturnType<typeof makeContentModel>
	}> {

	@property({type: String})
	label: string = "default"

	@property({type: Boolean, reflect: true})
	"mock-embed": boolean = false

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
		await this.#model.initialize(this.label)
	}

	#renderShow() {
		const show = this.#model.getShow(this.label)
		return show?.details ? html`
			<slot name=title>${show.details.title}</slot>
			${this.#embeds
				.obtain(show.details, this["mock-embed"])
					?? "(embed missing)"}
			<slot></slot>
		` : html`
			<slot name=no-show></slot>
		`
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
