
import styles from "./xiome-notes-indicator.css.js"
import bell from "../../../../framework/icons/bell.svg.js"

import {makeNotesModel} from "../../models/notes-model.js"
import {property} from "../../../../framework/component.js"
import {Component, mixinStyles, html, mixinRequireShare} from "../../../../framework/component.js"

@mixinStyles(styles)
export class XiomeNotesIndicator extends mixinRequireShare<{
		notesModel: ReturnType<typeof makeNotesModel>
	}>()(Component) {

	@property({attribute: "no-icon"})
	noIcon: boolean = false
 
	render() {

		const bellSpan = html`<span class="bell">${bell}</span>`;
		const {stats} = this.share.notesModel

		return html`
				${stats.newCount === 0 ? html`${bellSpan}`
				: html`
					<span class="count">${stats.newCount}</span>
					${bellSpan}
				`}
			`
	}
}

