
import {ops} from "../../../../framework/ops.js"
import {makeNotesModel} from "../../models/notes-model.js"
import {ComponentWithShare, mixinStyles, html} from "../../../../framework/component.js"

import styles from "./xiome-notes-button.css.js"

@mixinStyles(styles)
export class XiomeNotesButton extends ComponentWithShare<{
		notesModel: ReturnType<typeof makeNotesModel>
	}> {

	render() {
		const {state} = this.share.notesModel
		const stats = ops.value(state.statsOp) ?? {
			newCount: 0,
			oldCount: 0,
		}
		return html`
			<button>
				<span>${stats.newCount}</span>
				<span>notes icon goes here</span>
			</button>
		`
	}
}
