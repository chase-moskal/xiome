
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

	#renderNewNotes(notes: Notes.Any[]) {
		const{previousPage, nextPage, markNotesNewOrOld} = this.#cache
		return html`
			<div>
				<xio-button
					@press=>
						X
				</xio-button>
				<ol>
					${notes.map(note => html`
						<li>
							<p>noteId: ${note.noteId}</p>
							<p>noteTitle: ${note.title}</p>
						</li>
					`)}
				</ol>
				<div>
					<xio-button
						@press=${previousPage}>
							p
					</xio-button>
					<p>1/10</p>
					<xio-button
						@press=${nextPage}>
							n
					</xio-button>
				</div>
				<xio-button
						@press=${markNotesNewOrOld}>
							Mark all Old
				</xio-button>
			</div>
		`
	}


	#renderOldNotes(notes: Notes.Any[]) {
		const{previousPage, nextPage} = this.#cache
		return html`
			<div>
				<xio-button
					@press=>
						X
				</xio-button>
				<ol>
					${notes.map(note => html`
						<li>
							<p>noteId: ${note.noteId}</p>
							<p>noteTitle: ${note.title}</p>
						</li>
					`)}
				</ol>
				<div>
					<xio-button
						@press=${previousPage}>
							p
					</xio-button>
					<p>1/10</p>
					<xio-button
						@press=${nextPage}>
							n
					</xio-button>
				</div>
			</div>
		`
	}

	render() {
		const {cacheState} = this.#cache
		return html`
			<h3>xiome-notes</h3>
			<xio-button
					@press=${renderOp(cacheState.NotesOp, notes => this.#renderNewNotes(notes))}>
						NEW
			</xio-button>
			<xio-button
					@press=${renderOp(cacheState.NotesOp, notes => this.#renderOldNotes(notes))}>
						OLD
			</xio-button>
		`
	}
}
