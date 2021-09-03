
import {makeLivestreamModel} from "../models/livestream-model.js"
import {ModalSystem} from "../../../assembly/frontend/modal/types/modal-system.js"
import {ComponentWithShare, html, mixinStyles, property} from "../../../framework/component/component.js"

import styles from "./styles/xiome-livestream.css.js"
import {LivestreamRights} from "./types/livestream-rights.js"
import {renderOp} from "../../../framework/op-rendering/render-op.js"

@mixinStyles(styles)
export class XiomeLivestream extends ComponentWithShare<{
		modals: ModalSystem
		livestreamModel: ReturnType<typeof makeLivestreamModel>
	}> {

	@property({type: String, reflect: true})
	label: string = "default"

	updated(props) {
		if (props.has("label") && props.get("label") !== this.label)
			this.share.livestreamModel.refreshShow("label")
	}

	#renderStreamViewer() {
		const show = this.share.livestreamModel.getShow(this.label)
		return html`
			<p>
				${show.vimeoId
					? `vimeo id ${show.vimeoId}`
					: `no vimeo id for show "${show.label}"`}
			</p>
		`
	}

	render() {
		switch (this.share.livestreamModel.getRights()) {
			case LivestreamRights.Forbidden: return html`
				<p>you are forbidden lol</p>
			`
			case LivestreamRights.Viewer: return html`
				<p>you are viewer</p>
				${this.#renderStreamViewer()}
			`
			case LivestreamRights.Moderator: return html`
				<p>you are moderator</p>
			`
		}
	}
}
