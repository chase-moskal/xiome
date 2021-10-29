
import {ops} from "../../../../framework/ops.js"
import {makeNotesModel} from "../../models/notes-model.js"
import {ComponentWithShare, mixinStyles, html} from "../../../../framework/component.js"
import bell from "../../../../framework/icons/bell.svg.js"
import {property} from "@lit/reactive-element/decorators/property.js"

import styles from "./xiome-notes-button.css.js"

@mixinStyles(styles)
export class XiomeNotesIndicator extends ComponentWithShare<{
		notesModel: ReturnType<typeof makeNotesModel>
	}> {
	@property({attribute: 'no-icon' })
	noIcon: boolean = true;
 
	render() {
		
		const {state} = this.share.notesModel
		const stats = ops.value(state.statsOp) ?? {
			newCount: 0,
			oldCount: 0,
		}
		return html`
				<span class="count">${stats.newCount}</span>
				<span class="bell">${bell}</span>
		`
	}
}
