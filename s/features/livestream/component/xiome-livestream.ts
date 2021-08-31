
import {makeLivestreamModel} from "../model/livestream-model.js"
import {ModalSystem} from "../../../assembly/frontend/modal/types/modal-system.js"
import {ComponentWithShare, html, mixinStyles} from "../../../framework/component/component.js"

import styles from "./styles/xiome-livestream.css.js"

@mixinStyles(styles)
export class XiomeLivestream extends ComponentWithShare<{
		modals: ModalSystem
		livestreamModel: ReturnType<typeof makeLivestreamModel>
	}> {

	render() {
		return html`
			<p>Example</p>
		`
	}
}
