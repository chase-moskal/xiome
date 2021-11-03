
import {ops} from "../../../../framework/ops.js"
import {makeNotesModel} from "../../models/notes-model.js"
import {ComponentWithShare, mixinStyles, html} from "../../../../framework/component.js"
import bell from "../../../../framework/icons/bell.svg.js"
import {property} from "../../../../framework/component.js"

import styles from "./xiome-notes-indicator.css.js"

@mixinStyles(styles)
export class XiomeNotesIndicator extends ComponentWithShare<{
		notesModel: ReturnType<typeof makeNotesModel>
	}> {
	@property({attribute: "no-icon"})
	noIcon: boolean = false
 
	render() {

		const bellSpan = html`<span class="bell">${bell}</span>`;
		const {state} = this.share.notesModel
		const stats = ops.value(state.statsOp) ?? {
			newCount: 0,
			oldCount: 0,
		}

		return html`
				${stats.newCount === 0 ? html`${bellSpan}`
				: html`
					<span class="count">${stats.newCount}</span>
					${bellSpan}
				`}
			`
	}
}

