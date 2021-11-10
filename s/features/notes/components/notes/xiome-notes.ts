
import styles from "./xiome-notes.css.js"
import {makeNotesModel} from "../../models/notes-model.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ComponentWithShare, mixinStyles, html} from "../../../../framework/component.js"

@mixinStyles(styles)
export class XiomeNotes extends ComponentWithShare<{
		notesModel: ReturnType<typeof makeNotesModel>
	}> {

	#cache = this.share.notesModel.createNotesCache()

	async init() {
		await this.#cache.fetchAppropriateNotes()
	}

	subscribe() {
		const unsubs = [
			super.subscribe(),
			this.#cache.subscribe(() => this.requestUpdate()),
		]
		return () => unsubs.forEach(unsub => unsub())
	}

	#renderTabs() {
		const {switchTabNew, switchTabOld} = this.#cache
		return html`
			<div class=tabs>
				<xio-button @press=${switchTabNew}>
					new
				</xio-button>
				<xio-button @press=${switchTabOld}>
					old
				</xio-button>
			</div>
		`
	}

	#renderNotes() {
		const {old} = this.#cache.cacheState
		const {markSpecificNoteNew, markSpecificNoteOld} = this.#cache
		return renderOp(this.#cache.cacheState.notesOp, notes => html`
			<ol>
				${notes.map(note => html`
					<li>
						<p>noteId: ${note.noteId}</p>
						<p>noteTitle: ${note.title}</p>
						${old ? html`
							<xio-button @press=${() => markSpecificNoteNew(note.noteId)}>
								+
							</xio-button>
						` : html`
							<xio-button @press=${() => markSpecificNoteOld(note.noteId)}>
								x
							</xio-button>
						`}
					</li>
				`)}
			</ol>
		`)
	}

	#renderPagination() {
		const {pageNumber} = this.#cache.cacheState
		const {
			nextPage, previousPage,
			totalPages, isNextPageAvailable, isPreviousPageAvailable,
		} = this.#cache
		return html`
			<xio-button
				?disabled=${!isPreviousPageAvailable}
				@press=${previousPage}>
					previous
			</xio-button>
			<span>
				${pageNumber} / ${totalPages}
			</span>
			<xio-button
				?disabled=${!isNextPageAvailable}
				@press=${nextPage}>
					next
			</xio-button>
		`
	}

	#renderButtonbar() {
		const {old} = this.#cache.cacheState
		const {markAllNotesOld} = this.#cache
		return html`
			<div class=buttonbar>
				${old
					? null
					: html`
						<xio-button @press=${markAllNotesOld}>
							mark all old
						</xio-button>
					`}
			</div>
		`
	}

	render() {
		return html`
			<h3>xiome-notes</h3>
			${this.#renderTabs()}
			${this.#renderNotes()}
			${this.#renderPagination()}
			${this.#renderButtonbar()}
		`
	}
}
