
import {makeLivestreamModel} from "../model/livestream-model.js"
import {ModalSystem} from "../../../assembly/frontend/modal/types/modal-system.js"
import {ComponentWithShare, html, mixinStyles, property} from "../../../framework/component/component.js"

import styles from "./styles/xiome-livestream.css.js"

@mixinStyles(styles)
export class XiomeLivestream extends ComponentWithShare<{
		modals: ModalSystem
		livestreamModel: ReturnType<typeof makeLivestreamModel>
	}> {

	@property({type: String, reflect: true})
	label: string = "default"

	render() {
		const {livestreamModel} = this.share
		const show = livestreamModel.getShow(this.label)
		return html`
			<p>Livestream</p>
			<p>
				${show.vimeoId
					? `vimeo id ${show.vimeoId}`
					: `no vimeo id for show "${show.label}"`}
			</p>
		`
	}
}
