
import styles from "./xiome-notes.css.js"
import {makeNotesModel} from "../../models/notes-model.js"
import {ComponentWithShare, mixinStyles, html} from "../../../../framework/component.js"

@mixinStyles(styles)
export class XiomeNotes extends ComponentWithShare<{
		notesModel: ReturnType<typeof makeNotesModel>
	}> {

	render() {
		const {notesModel} = this.share
		return html`
			<p>xiome-notes</p>
		`
	}
}
