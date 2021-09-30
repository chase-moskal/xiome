
import styles from "./xiome-video-display.css.js"
import {VideoView} from "../../types/video-concepts.js"
import {makeContentModel} from "../../models/parts/content-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ComponentWithShare, mixinStyles, html, property} from "../../../../framework/component/component.js"
import {videoControls} from "./parts/controls/video-controls.js"

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

	#renderShow() {
		const show = this.model.getShow(this.label)
		return show ? html`
			<p>show ${show.title}</p>
			<ul>
				<li>${show.id}</li>
				<li>${show.embed}</li>
			</ul>
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
