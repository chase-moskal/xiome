
import styles from "./xiome-video-display.css.js"
import {makeContentModel} from "../../models/parts/content-model.js"
import {ComponentWithShare, mixinStyles, html, property} from "../../../../framework/component/component.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {ops} from "../../../../framework/ops.js"

@mixinStyles(styles)
export class XiomeVideoDisplay extends ComponentWithShare<{
		contentModel: ReturnType<typeof makeContentModel>
	}> {

	@property({type: String})
	label: string = "default"

	get model() {
		return this.share.contentModel
	}

	async init() {
		await this.model.initialize(this.label)
	}

	#renderVideoControls = (access: AccessPayload) => {
		const {model, label} = this
		return html`
			<h2>video display controls</h2>
			<p>this view <em>"${label}"</em></p>
			<p>${model.getView(label)?.id ?? "none"}</p>
			<p>all other views</p>
			<ol>
				${model.views.map(view => html`
					<li>id: ${view.id}</li>
				`)}
			</ol>
		`
	}

	render() {
		return renderOp(
			this.model.state.accessOp,
			this.#renderVideoControls,
		)
	}
}
