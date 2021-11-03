
import styles from "./xiome-notes.css.js"
import {makeNotesModel} from "../../models/notes-model.js"
import {ComponentWithShare, mixinStyles, html} from "../../../../framework/component.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"

@mixinStyles(styles)
export class XiomeNotes extends ComponentWithShare<{
		notesModel: ReturnType<typeof makeNotesModel>
	}> {

	#cache = this.share.notesModel.createNotesCache()

	subscribe() {
		const unsubs = [
			super.subscribe(),
			this.#cache.subscribe(() => this.requestUpdate()),
		]
		return () => unsubs.forEach(unsub => unsub())
	}

	render() {
		const {cacheState} = this.#cache
		return html`
			<p>xiome-notes</p>
			${renderOp(cacheState.newNotesOp, newNotes => html`
				<ol>
					${newNotes.map(note => html`
						<li>
							<p>noteId: ${note.noteId}</p>
							<p>noteTitle: ${note.title}</p>
						</li>
					`)}
				</ol>
			`)}
		`
	}
}
