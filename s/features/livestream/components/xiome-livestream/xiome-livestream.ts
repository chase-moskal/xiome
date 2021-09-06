
import {makeLivestreamModel} from "../../models/livestream-model.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {ComponentWithShare, html, mixinStyles, property} from "../../../../framework/component/component.js"

import styles from "./styles/xiome-livestream.css.js"
import {LivestreamRights} from "../../models/types/livestream-rights.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {validateVimeoField} from "../../api/validation/livestream-validators.js"
import {generateVimeoUrl} from "../../models/utils/generate-vimeo-url.js"
import {ops} from "../../../../framework/ops.js"
import {ValueChangeEvent} from "../../../xio-components/inputs/events/value-change-event.js"

@mixinStyles(styles)
export class XiomeLivestream extends ComponentWithShare<{
		modals: ModalSystem
		livestreamModel: ReturnType<typeof makeLivestreamModel>
	}> {

	@property({type: String, reflect: true})
	label: string = "default"

	get state() {
		return this.share.livestreamModel.state
	}

	updated(props) {
		if (props.has("label") && props.get("label") !== this.label)
			this.share.livestreamModel.loadShow(this.label)
	}

	#renderStreamViewer = () => {
		const showOp = this.share.livestreamModel.getShow(this.label)
		return renderOp(showOp, show => html`
			<p>
				${show.vimeoId
					? `label "${show.label}", vimeo id ${show.vimeoId}`
					: `no vimeo id for show "${show.label}"`}
			</p>
		`)
	}

	#renderForRights = () => {
		const {livestreamModel} = this.share
		switch (this.share.livestreamModel.getRights()) {
			case LivestreamRights.Forbidden: return html`
				<p>you are forbidden lol</p>
			`
			case LivestreamRights.Viewer: return html`
				<p>you are viewer</p>
				${this.#renderStreamViewer()}
			`
			case LivestreamRights.Moderator: {
				const showOp = livestreamModel.getShow(this.label)
				const show = ops.value(showOp)
				const initial = (show && show.vimeoId)
					? generateVimeoUrl(show.vimeoId)
					: ""
				const onValueChange = (event: ValueChangeEvent<string>) => {
					console.log("ON VALUE CHANGE", event)
				}
				return html`
					<p>you are moderator</p>
					<div class=modbox>
						<xio-text-input
							.initial="${initial}"
							.validator=${validateVimeoField}
							?disabled=${!ops.isReady(showOp)}
							@valuechange=${onValueChange}>
								vimeo url
						</xio-text-input>
					</div>
					${this.#renderStreamViewer()}
				`
			}
		}
	}

	render() {
		return renderOp(
			this.state.accessOp,
			() => renderOp(
				this.share.livestreamModel.getShow(this.label),
				this.#renderForRights,
			)
		)
	}
}
