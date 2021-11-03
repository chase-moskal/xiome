
import styles from "./xiome-notes.css.js"
import {makeNotesModel} from "../../models/notes-model.js"
import {ComponentWithShare, mixinStyles, html} from "../../../../framework/component.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {Notes} from "../../types/notes-concepts.js"

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

	#renderNotes(notes: Notes.Any[]) {
		return html`
			<ol>
				${notes.map(note => html`
					<li>
						<p>noteId: ${note.noteId}</p>
						<p>noteTitle: ${note.title}</p>
					</li>
				`)}
			</ol>
		`
	}

	render() {
		const {cacheState} = this.#cache
		return html`
			<h3>xiome-notes</h3>
			<p>new notes:</p>
			${renderOp(cacheState.newNotesOp, notes => this.#renderNotes(notes))}
			<p>old notes:</p>
			${renderOp(cacheState.oldNotesOp, notes => this.#renderNotes(notes))}
		`
	}
}
