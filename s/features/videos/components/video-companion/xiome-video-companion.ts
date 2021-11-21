
import {ops} from "../../../../framework/ops.js"
import styles from "./xiome-video-companion.css.js"
import {makeContentModel} from "../../models/parts/content-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ComponentWithShare, mixinStyles, html, property} from "../../../../framework/component.js"

@mixinStyles(styles)
export class XiomeVideoCompanion extends ComponentWithShare<{
		contentModel: ReturnType<typeof makeContentModel>
	}> {

	get #model() {
		return this.share.contentModel
	}

	@property({type: String})
	label: string = "default"

	init() {
		this.#model.initialize(this.label)
	}

	render() {
		const show = this.#model.getShow(this.label)
		const {accessOp, showsOp} = this.#model.state
		const combinedOp = ops.combine(accessOp, showsOp)
		return renderOp(combinedOp, () =>
			show
				? show.details
					? html`<slot></slot>`
					: html`<slot name=unprivileged></slot>`
				: html`<slot name=unavailable></slot>`
		)
	}
}
