
import {makeLivestreamModel} from "../../models/livestream-model.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {ComponentWithShare, html, mixinStyles, property, query} from "../../../../framework/component.js"

import styles from "./styles/xiome-livestream.css.js"
import {LivestreamRights} from "../../models/types/livestream-rights.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {validateVimeoField} from "../../api/validation/livestream-validators.js"
import {generateVimeoUrl} from "../../models/utils/generate-vimeo-url.js"
import {ops} from "../../../../framework/ops.js"
import {ValueChangeEvent} from "../../../xio-components/inputs/events/value-change-event.js"
import {XioTextInput} from "../../../xio-components/inputs/xio-text-input.js"
import {parseVimeoId} from "../../models/utils/parse-vimeo-id.js"

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

	#getCurrentVimeoId() {
		const showOp = this.share.livestreamModel.getShow(this.label)
		const show = ops.value(showOp)
		return (show && show.vimeoId)
			? show.vimeoId
			: ""
	}

	#changed = false
	#vimeoIdDraft: string

	#vimeoFieldOnValueChange({detail: {value}}: ValueChangeEvent<string>) {
		this.#changed = true
		this.#vimeoIdDraft = value
			? parseVimeoId(value)
			: ""
		this.requestUpdate()
	}

	#vimeoIdDraftIsDifferent() {
		const showOp = this.share.livestreamModel.getShow(this.label)
		return this.#changed && ops.isReady(showOp)
			? this.#vimeoIdDraft !== this.#getCurrentVimeoId()
			: false
	}

	#submitVimeoId() {
		this.#changed = false
		const vimeoId = this.#vimeoIdDraft
		this.share.livestreamModel.commitShow({
			vimeoId,
			label: this.label,
		})
	}

	#renderModBox = () => {
		const showOp = this.share.livestreamModel.getShow(this.label)
		const currentVimeoId = this.#getCurrentVimeoId()
		const currentVimeoUrl = currentVimeoId.length
			? generateVimeoUrl(currentVimeoId)
			: ""
		const draftIsDifferent = this.#vimeoIdDraftIsDifferent()
		return renderOp(showOp, () => html`
			<div class=modbox>
				<xio-text-input
					class=vimeo-field
					.initial="${currentVimeoUrl}"
					show-validation-when-empty
					?hide-validation=${!draftIsDifferent}
					.validator=${validateVimeoField}
					?disabled=${!ops.isReady(showOp)}
					@valuechange=${this.#vimeoFieldOnValueChange}>
						vimeo url
				</xio-text-input>
				<xio-button
					?disabled=${!draftIsDifferent}
					@press=${this.#submitVimeoId}>
						set livestream
				</xio-button>
			</div>
		`)
	}

	#renderForRights = () => {
		switch (this.share.livestreamModel.state.rights) {
			case LivestreamRights.Forbidden: return html`
				<p>you are forbidden lol</p>
			`
			case LivestreamRights.Viewer: return html`
				<p>you are viewer</p>
				${this.#renderStreamViewer()}
			`
			case LivestreamRights.Moderator: return html`
				<p>you are moderator</p>
				${this.#renderModBox()}
				${this.#renderStreamViewer()}
			`
		}
	}

	render() {
		return renderOp(
			this.state.accessOp,
			this.#renderForRights
		)
	}
}
